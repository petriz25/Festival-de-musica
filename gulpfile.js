const {src, dest, watch, parallel} = require("gulp");

//CSS
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');

//JavaScript
const terser = require('terser');

//IMAGENES
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const cache = require('gulp-cache');
const avif = require('gulp-avif')

function css(done){
    src("src/scss/**/*.scss") //Identificar el archivo de SASS
        .pipe(plumber()) //No interrumpe la ejecución por errores
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sass()) //Compilar el archivo
        .pipe(dest("build/css")); //Guardarlo 


    done(); //Callback
}

function imagenes(done){
    const opciones = {
        optimizationLevel: 3
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(cache(imagemin(opciones)))
    .pipe(dest('build/img'))

    done();
}

function versionWebp(done){
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones))
    .pipe(dest('build/img'))

    done();
}

function versionAvif(done){
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(dest('build/img'))

    done();
}

function javascript(done ){
    src('src/js/**/*.js')
    .pipe(terser())
    .pipe(dest('build/js'));

    done();
}

function dev(done){
    watch("src/scss/**/*.scss", css);
    watch("src/js/**/*.js", javascript);

    done();
}

exports.css=css;
exports.js=javascript;
exports.imagenes=imagenes;
exports.dev=parallel(versionWebp, dev, javascript, imagenes, versionAvif);
exports.versionWebp = versionWebp;
exports.versionAvif=versionAvif;