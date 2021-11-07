#include "compare.h"

struct compare_im_ctx {
    Nan::Callback * callback;
    std::string error;
    double result;

    char* firstImageData;
    size_t firstImageLength;

    char* secondImageData;
    size_t secondImageLength;

    std::string metric;

    compare_im_ctx() {}
};

void DoCompare(uv_work_t* req) {
    compare_im_ctx* context = static_cast<compare_im_ctx*>(req->data);

    Magick::Blob firstImageBlob(context->firstImageData, context->firstImageLength);
    Magick::Blob secondImageBlob(context->secondImageData, context->secondImageLength);

    Magick::Image firstImage;

    try {
        firstImage.read(firstImageBlob);
    } catch (std::exception& err) {
        context->error = err.what();
        return;
    } catch (...) {
        context->error = std::string("unhandled error with original image");
        return;
    }

    Magick::Image secondImage;

    try {
        secondImage.read(secondImageBlob);
    } catch (std::exception& err) {
        context->error = err.what();
        return;
    } catch (...) {
        context->error = std::string("unhandled error with compare image");
        return;
    }

    if (context->metric == "AE") {
        context->result = firstImage.compare(secondImage, MagickCore::AbsoluteErrorMetric);
    } else if (context->metric == "DSSIM") {
        context->result = firstImage.compare(secondImage, MagickCore::StructuralDissimilarityErrorMetric);
    } else if (context->metric == "FUZZ") {
        context->result = firstImage.compare(secondImage, MagickCore::FuzzErrorMetric);
    } else if (context->metric == "MAE") {
        context->result = firstImage.compare(secondImage, MagickCore::MeanAbsoluteErrorMetric);
    } else if (context->metric == "MEPP") {
        context->result = firstImage.compare(secondImage, MagickCore::MeanErrorPerPixelErrorMetric);
    } else if (context->metric == "MSE") {
        context->result = firstImage.compare(secondImage, MagickCore::MeanSquaredErrorMetric);
    } else if (context->metric == "NCC") {
        context->result = firstImage.compare(secondImage, MagickCore::NormalizedCrossCorrelationErrorMetric);
    } else if (context->metric == "PAE") {
        context->result = firstImage.compare(secondImage, MagickCore::PeakAbsoluteErrorMetric);
    } else if (context->metric == "PHASH") {
        context->result = firstImage.compare(secondImage, MagickCore::PerceptualHashErrorMetric);
    } else if (context->metric == "PSNR") {
        context->result = firstImage.compare(secondImage, MagickCore::PeakSignalToNoiseRatioErrorMetric);
    } else if (context->metric == "RMSE") {
        context->result = firstImage.compare(secondImage, MagickCore::RootMeanSquaredErrorMetric);
    } else if (context->metric == "SSIM") {
        context->result = firstImage.compare(secondImage, MagickCore::StructuralSimilarityErrorMetric);
    } else {
        context->error = std::string("metric unknown");
    }
}

void ResultAfter(uv_work_t* req) {
    Nan::HandleScope scope;

    compare_im_ctx* context = static_cast<compare_im_ctx*>(req->data);
    delete req;

    Local<Value> argv[2];

    if (!context->error.empty()) {
        argv[0] = Exception::Error(Nan::New<String>(context->error.c_str()).ToLocalChecked());
        argv[1] = Nan::Undefined();
    }
    else {
        argv[0] = Nan::Undefined();
        argv[1] = Nan::New<Number>(context->result);
    }

    Nan::TryCatch try_catch;

    Nan::AsyncResource resource("ResultAfter");
    context->callback->Call(2, argv, &resource);

    delete context->callback;
    delete context;

    if (try_catch.HasCaught()) {
#if NODE_VERSION_AT_LEAST(0, 12, 0)
        Nan::FatalException(try_catch);
#else
        FatalException(try_catch);
#endif
    }
}

#define RETURN_RESULT_OR_ERROR(req) \
    do { \
        compare_im_ctx* _context = static_cast<compare_im_ctx*>(req->data); \
        if (!_context->error.empty()) { \
            Nan::ThrowError(_context->error.c_str()); \
        } else { \
            info.GetReturnValue().Set(Nan::New<Number>(_context->result)); \
        } \
        delete req; \
    } while(0);

NAN_METHOD(Version) {
    Nan::HandleScope();

    info.GetReturnValue().Set(Nan::New<String>(MagickLibVersionText).ToLocalChecked());
}

NAN_METHOD(Compare) {
    Nan::HandleScope();

    bool isSync = (info.Length() == 1);

    if (info.Length() < 1) {
        return Nan::ThrowError("compare() requires 2 (option) argument!");
    }

    if (!info[0]->IsObject() ) {
        return Nan::ThrowError("compare()'s 1st argument should be an object");
    }

    if(!isSync && !info[1]->IsFunction() ) {
        return Nan::ThrowError("compare()'s 2nd argument should be a function");
    }

    Local<Object> obj = Local<Object>::Cast(info[0]);
    Local<Object> firstImageData = Local<Object>::Cast(Nan::Get(obj, Nan::New<String>("originalImage").ToLocalChecked()).ToLocalChecked());
    Local<Object> secondImageData = Local<Object>::Cast(Nan::Get(obj, Nan::New<String>("compareWith").ToLocalChecked()).ToLocalChecked());

    if (firstImageData->IsUndefined() || !Buffer::HasInstance(firstImageData)) {
        return Nan::ThrowError("compare()'s 1st argument should have \"originalImage\" key with a Buffer instance");
    }

    if (firstImageData->IsUndefined() || !Buffer::HasInstance(secondImageData)) {
        return Nan::ThrowError("compare()'s 1st argument should have \"compareWith\" key with a Buffer instance");
    }

    compare_im_ctx* context = new compare_im_ctx();

    context->firstImageData = Buffer::Data(firstImageData);
    context->firstImageLength = Buffer::Length(firstImageData);

    context->secondImageData = Buffer::Data(secondImageData);
    context->secondImageLength = Buffer::Length(secondImageData);

    Local<Value> metricValue = Nan::Get(obj, Nan::New<String>("metric").ToLocalChecked()).ToLocalChecked();
    context->metric = !metricValue->IsUndefined() ? *Nan::Utf8String(metricValue) : "SSIM";

    uv_work_t* req = new uv_work_t();
    req->data = context;

    if(!isSync) {
        context->callback = new Nan::Callback(Local<Function>::Cast(info[1]));
        uv_queue_work(uv_default_loop(), req, DoCompare, (uv_after_work_cb)ResultAfter);
        return;
    } else {
        DoCompare(req);
        RETURN_RESULT_OR_ERROR(req)
    }
}

void init(Local<Object> exports) {
    Nan::SetMethod(exports, "version", Version);
    Nan::SetMethod(exports, "compare", Compare);
}

NODE_MODULE(compare, init)
