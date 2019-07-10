module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                win: {
                    target: [{
                        target: "nsis",
                        arch: [/*"x64", */"ia32"]
                    }]
                }
            }
        }
    }
}
