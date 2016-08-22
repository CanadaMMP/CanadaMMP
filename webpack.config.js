var config = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js', //this is the default name, so you can skip it
        //at this directory our bundle file will be available
        //make sure port 8090 is used when launching webpack-dev-server
        publicPath: 'http://localhost:8090/assets'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};

module.exports = config;
