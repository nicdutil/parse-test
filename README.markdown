Overview
--------

This app showcases [dynamic websites](https://www.parse.com/docs/cloud_code_guide#webapp)
using Parse Hosting. It's a classic meme
generator that lets users create memes and
share them with the world. There's
no need for user authentication, as memes
are readonly.

You can check out the official hosted version
at [www.anymeme.org](http://www.anymeme.org).

Setup
-----

1. Created a new app on Parse, and make sure you go
through our [getting started guide for Cloud Code](https://parse.com/docs/cloud_code_guide#started-installing).

2. Create a new Facebook app.

3. Install compass: http://compass-style.org

4. Type `parse new .` in the directory where this
README resides, authenticate with your Parse credentials,
and choose the app name you created.

5. Delete `public/index.html`

6. Edit `cloud/app.js` and put in your Parse Application ID, Parse
JavaScript Key, and Facebook Application ID in the key setup
section. You can find your app keys in your app settings
page under "Application Keys".

7. Type `parse deploy`. This deploys your app to Parse.

8. Now, we'll need to configure the url where you can
reach your app. Go to your app's setting page and set
a unique subdomain for your Web Hosting url.

9. Go to yoursubdomain.parseapp.com and view your copy of Anymeme!

10. Optional: If you want to change the CSS, make sure to
run "compass watch" so that the .scss files will get
compiled into css files in the public folder.

![Signed up for Parse, made a meme platform](http://files.parse.com/a93299c2-d7be-4ea4-b15f-153e693ad8fb/4fa8a62c-c4c9-433d-a01c-43698e3b6c8a-meme.jpg)

Adding Your Own Memes
---------------------

This project contains some pictures of Parse employees. You can switch out
with your own memes by:

1. Adding a JPG to `public/images`.
2. Specifying the name and image name in `public/js/templates.js`.
