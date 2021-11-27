{
    'conditions': [
        [
            'OS=="mac"', 
            {
                'variables': {
                    'OSX_VER%': "<!(sw_vers | grep 'ProductVersion:' | grep -o '10.[0-9]*')",
                }
            }, 
            {
                'variables': {
                    'OSX_VER%': "0",
                }
            }
        ]
    ],
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
                    'OSX_VER == "10.9" or OSX_VER == "10.10" or OSX_VER == "10.11" or OSX_VER == "10.12" or OSX_VER == "10.13"', 
                    {
                        'xcode_settings': {
                            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
                            'OTHER_CFLAGS': [
                                '<!@(pkg-config --cflags Magick++)'
                            ],
                            'OTHER_CPLUSPLUSFLAGS' : [
                                '<!@(pkg-config --cflags Magick++)',
                                '-std=c++11',
                                '-stdlib=libc++',
                            ],
                            'OTHER_LDFLAGS': ['-stdlib=libc++'],
                            'MACOSX_DEPLOYMENT_TARGET': '10.7',
                        },
                        'libraries': [
                            '<!@(pkg-config --libs Magick++)',
                        ],
                        'cflags': [
                            '<!@(pkg-config --cflags Magick++)'
                        ],
                    }
                ],
                [
                    'OS=="mac"', 
                    {
                        'xcode_settings': {
                            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
                            'OTHER_CFLAGS': [
                                '<!@(pkg-config --cflags Magick++)'
                            ]
                        },
                        'libraries': [
                            '<!@(pkg-config --libs Magick++)',
                        ],
                        'cflags': [
                            '<!@(pkg-config --cflags Magick++)'
                        ],
                    }
                ],
                [
                    'OS=="linux" or OS=="solaris" or OS=="freebsd"', {
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
