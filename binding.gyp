{
    'targets': [
        {
            'target_name': 'compare',
            'sources': [
                'src/cpp/compare.cc'
            ],
            'cflags!': [
                '-fno-exceptions'
            ],
            'cflags_cc!': [
                '-fno-exceptions'
            ],
            'include_dirs' : [
                '<!(node -e \'require("nan")\')'
            ],
            'conditions': [
                [
                    'OS=="linux"', {
                        'libraries': [
                            '<!@(pkg-config --libs Magick++)',
                        ],
                        'cflags': [
                            '<!@(pkg-config --cflags Magick++)'
                        ],
                    }
                ]
            ]
        }
    ]
}
