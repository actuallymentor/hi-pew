# 👋 🔫 HI PEW - High Performance Website Boilerplate

<img height="50px" style="float: left;" alt="webpack" src="http://i.imgur.com/xz36f45.png" /> <img height="50px" style="float: left;" alt="browsersync" src="http://i.imgur.com/L5peje9.png" /> <img height="50px" style="float: left;" alt="pug" src="http://i.imgur.com/x4sHEg4.png" /> <img height="50px" style="float: left;" alt="sass" src="http://i.imgur.com/O9ikKdz.png" />

A static website generator that implements best practices for page speed. [ pug ]( https://github.com/pugjs ), Write styling in [ Sass ]( https://github.com/sass/sass ) and Javascript go in, deployment-ready minified, prefixed and compressed build files come out.

Benefits:

- [Over 95% Google Page Speed Score]( https://actuallymentor.github.io/webpack-frontend-only/ )
- Use `pug`, `sass` and the newest `js` with zero setup time
- SEO best practiced auto-implemented

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
3. Enable auto-deployment
    - Templates for Github pages, Firebase and AWS are available in `.github/workflows`

### Multiple languages

In the `src/content` folder you can add `.json` files that are used to add parse content into your `.pug` files. Their syntax is:

```json
{
    "slug": "/",
    "lang": "en",
    "text": {
        "title": "something",
        "explanation": "lorem ipsum"
    }
}
```

The `lang` attribute is used on the `html` element to declare the language. The other attributes can be read inside any pug template under the `content` variable, for example:

```pug
div.thing
    p#title #{ content.text.title }
    a( href=content.slug ) home
```
