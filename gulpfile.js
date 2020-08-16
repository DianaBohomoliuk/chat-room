const {src, dest, parallel, series, watch} = require('gulp');
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const autoPrefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const ttfToWoff = require('gulp-ttf2woff');
const ttfToWoff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const del = require('del');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const util = require('gulp-util');
const ftp = require( 'vinyl-ftp' );





const fonts = () =>{
    src('./src/fonts/**.ttf')
    .pipe(ttfToWoff())
    .pipe(dest('./app/fonts/'))
    return src ('./src/fonts/**.ttf')
    .pipe(ttfToWoff2())
    .pipe(dest('./app/fonts/'))
}

const cb = () => {}

let srcFonts = './src/scss/_fonts.scss';
let appFonts = './app/fonts/';

const fontsStyle = (done) => {
	let file_content = fs.readFileSync(srcFonts);

	fs.writeFile(srcFonts, '', cb);
	fs.readdir(appFonts, function (err, items) {
		if (items) {
			let c_fontname;
			for (var i = 0; i < items.length; i++) {
				let fontname = items[i].split('.');
				fontname = fontname[0];
				if (c_fontname != fontname) {
					fs.appendFile(srcFonts, '@include font-face("' + fontname + '", "' + fontname + '", 400);\r\n', cb);
				}
				c_fontname = fontname;
			}
		}
	})

	done();
}


const styles = () =>{
    return src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(autoPrefixer({
        cascade:false
    }))
    .pipe(cleanCSS({
        level:2
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/css/'))
    .pipe(browserSync.stream());

}



const htmlInclude = () =>{
    return src(['./src/index.html'])
    .pipe(fileInclude({
        prefix: '@',
        basepath: '@file'
    }))
    .pipe(dest('./app'))
    .pipe(browserSync.stream())
}


const imgToApp = () =>{
    return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'])
    .pipe(dest('./app/img'))
}

const svgSprites = () =>{
    return src('./src/img/**.svg')
    .pipe(svgSprite({
        mode: {
            stack: {
              sprite: '../sprite.svg'
            }
          }
    }))
    .pipe(dest('./app/img'))
}

const scripts = () =>{
    return src('./src/js/main.js')
    .pipe(webpackStream({
        output:{
            filename: 'main.js'
        },
        module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              }
            ]
          }
    }))
    .on('error', function (err) {
        console.error('WEBPACK ERROR', err);
        this.emit('end'); // Don't stop the rest of the task
    })
    .pipe(sourcemaps.init())
    .pipe(uglify().on('error', notify.onError()))
    .pipe(sourcemaps.write())
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream());


}

const clean = () =>{
    return del(['app/*'])
}
const resources = () =>{
    return src(['./src/resources/**'])
    .pipe(dest('./app'))
}

const live = () =>{
    browserSync.init({
        server:{
            baseDir:'./app'
        }
    });
    watch('./src/scss/**/*.scss', styles);
    watch('./src/**.html', htmlInclude);
    watch('./src/img/**.jpg', imgToApp);
    watch('./src/img/**.png', imgToApp);
    watch('./src/img/**.jpeg', imgToApp);
    watch('./src/img/**.svg', svgSprites);
    watch('./src/resources/**', resources);
    watch('./src/fonts/**.ttf', fonts);
    watch('./src/fonts/**.ttf', fontsStyle);
    watch('./src/fonts/**.ttf', clean);
    watch('./src/js/**/*.js', scripts);


}
exports.styles = styles;
exports.live = live;
exports.fileinclude = htmlInclude;



exports.default = series(clean, scripts, parallel(htmlInclude, fonts, imgToApp), fontsStyle, styles, live);

const compress = () =>{
    return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'])
    .pipe(imagemin())
    .pipe(dest('./app/img'))

}

const scriptsBuild = () =>{
    return src('./src/js/main.js')
    .pipe(webpackStream({
        output:{
            filename: 'main.js'
        },
        module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              }
            ]
          }
    }))
    .on('error', function (err) {
        console.error('WEBPACK ERROR', err);
        this.emit('end'); // Don't stop the rest of the task
    })
    .pipe(uglify().on('error', notify.onError()))
    .pipe(dest('./app/js'))



}

const stylesBuild = () =>{
    return src('./src/scss/**/*.scss')
    .pipe(sass({
        outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(autoPrefixer({
        cascade:false
    }))
    .pipe(cleanCSS({
        level:2
    }))
    .pipe(dest('./app/css/'))

}

exports.build = series(clean, scriptsBuild, parallel(htmlInclude, fonts, imgToApp, svgSprites), fontsStyle, stylesBuild, compress);


const deploy = () => {
	let conn = ftp.create({
		host: '',
		user: '',
		password: '',
		parallel: 10,
		log: gutil.log
	});

	let globs = [
		'app/**',
	];

	return src(globs, {
			base: './app',
			buffer: false
		})
		.pipe(conn.newer('')) // only upload newer files
		.pipe(conn.dest(''));
}

exports.deploy = deploy;