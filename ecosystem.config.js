module.exports = {
    apps: [
        {
            name: "ngc5195",
            script: "./build/src",
            watch: false,
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
