# 👋 🔫 HI PEW - High Performance Website Boilerplate

<img height="50px" style="float: left;" alt="webpack" src="http://i.imgur.com/xz36f45.png" /> <img height="50px" style="float: left;" alt="browsersync" src="http://i.imgur.com/L5peje9.png" /> <img height="50px" style="float: left;" alt="pug" src="http://i.imgur.com/x4sHEg4.png" /> <img height="50px" style="float: left;" alt="sass" src="http://i.imgur.com/O9ikKdz.png" />

A static website generator that implements best practices for page speed. [ Click here for a live demo ]( https://actuallymentor.github.io/hi-pew/ ).

- input: Markup in [pug]( https://github.com/pugjs ), styling in [Sass]( https://github.com/sass/sass ) and Javascript with [Babel]( https://babeljs.io/ )
- output: deployment-ready minified, prefixed and compressed build files

Benefits:

- 🚀 100% Google Page Speed Score ([view score]( https://developers.google.com/speed/pagespeed/insights/?url=https://actuallymentor.github.io/hi-pew/ ))
- 👩‍💻 Use `pug`, `sass` and the newest `js` with zero setup time
- 👓 SEO best practices auto-implemented
- 🇪🇺 Built-in multilanguage support
- 🌐 Built-in broken link checker through `npm test`
- 🧪 Advanced performance options and compatibility warnings

## Getting started

Dependencies:

- [node.js]( https://nodejs.org/en/ )
- [nvm]( https://github.com/nvm-sh/nvm ) ( optional, recommended )

### Basic usage

1. Clone this repository
2. Run `npm start`, your browser will open with a live-updating preview
3. Edit the source files in `src/`
4. Configure SEO settings in `modules/config.js`

To create a production build in `docs/`:

```shell
npm run build
```

### Advanced usage

1. Customise auto-image compression
    - Edit the `system.images` key to include your compression preferences
    - Use the `rimg` mixin found in `src/pug/_helpers`
2. Separate your CSS for meaningful-paint optimisation
    - Use `src/css/essential-above-the-fold.sass` for essential above the fold styles
    - Use `src/css/styles.sass` for below the fold styles
3. Set per-page SEO settings
    - Every `.pug` file may contain it's own metadata and sharing image
4. Confgure deeper browser compatibility
    - Javascript backwards compatibility in `.babelrc`
    - CSS compatibility in `modules/config.js` at `browsers`
4. Enable auto-deployment
    - Templates for Github pages, Firebase and AWS are available in `.github/workflows`

### Multiple languages

Every `.json` or `.js` file in `src/content` will result in a duplicate of your website using the content in that file.

```js
module.exports = {
    slug: "/", // The relative URL of this language
    lang: "en", // The language code of this language (use W3 compliant codes)

    // You can creat any keys and access them
    hero: {
        "title": "something",
        "explanation": "lorem ipsum"
    },
    usps: [ "It's good", "It's free" ]
}
```

The attributes can be read inside any pug template under the `content` variable, for example:

```pug
div.hero
    p#title #{ content.hero.title }
    a( href=content.slug ) home
div.usp
    each usp in content.usps
        p= usp
```
