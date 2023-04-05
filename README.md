# multi-mandates-desktop-app

A desktop application to easily work with the XML to CSV parser that was built to extract double and triple mandates held by Finnish politicians.

The script itself can easily be modified to take into account any other data that may be presented in the XML file.

The required XML files can be found on the [Tulospalvelu website](https://tulospalvelu.vaalit.fi/).
From there you can navigate to any of the listed elections, select Tulokset (results), and finally Ladattavat tiedostot (downloadable files) on the right hand side.
Presented with the download options, select Tulokset ehdokkaittain (results per candidate) under the XML-teidostot header.

Unzip the file (warning, it may be very large and often contains over a million lines of XML).

Use the application to navigate to your files and automatically start the parsing process.

To work with the codebase locally, run <code>npm install</code> to install relevant dependencies.

Now you can run <code>npm start</code> to run the application in development.

Follow instructions [here](https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging) to package the application for prod. The application is not yet signed through code signing, as it is only meant for personal use.