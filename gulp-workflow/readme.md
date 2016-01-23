# Fond of Gulp-Workflow

Ein zentral verwalteter Gulp-Workflow für alle Fond of Bags Projekte

## Hintergrund
Ziel ist es, möglichst alle Fond of Bags Projekte mit der selben Software-Architektur umzusetzen. So wird ermöglicht, dass sich Entwickler möglichst schnell in allen Projekten zurechtfinden. Neue Projekte werden diesen Workflow von Anfang an nutzen und bestehende Projekte sollen mit der Zeit umgezogen werden.

## Benutzung

### Tasks

Folgende Tasks stehen für die Entwicklung zur Verfügung.

`gulp build:development` (synonym zu `gulp`) baut alle nötigen Assets zusammen und führt Code-Style-Checks durch. Es wird nicht minifiziert.

`gulp build:production` wird auch vom Build-Server (Jenkins) ausgeführt. Alle Assets werden zusammengebaut, minifiziert und optimiert.

`gulp watch` führt zunächst `gulp` aus, überwacht alle Frontend-Dateien und startet jeweilis die richtigen Tasks, je nachdem welche Dateitypen sich verändert haben.

`gulp serve` identisch zum Watch-Task, allerdings wird zusätzlich Browsersync aktiviert, so dass sich der Browser bei Änderungen automatisch aktualisiert. Dafür ist es erforderlich, dass der richtige [Proxy-Eintrag](https://bitbucket.org/fondofbags/magento-project-skeleton/src/master/src/theme/skin/frontend/fondofbags/custom/gulpconfig.local.js?fileviewer=file-view-default) in der `gulpconfig.local.js` eingetragen wird. Mit `gulp serve --no-open` kann verhindert werden, dass sich automatisch das Browserfenster öffnet.

### Modernizr

Modernizr ist in den Build-Workflow integriert. Abhängig davon welche Modernizr-Tests (im Sass oder JavaScript) genutzt werden, wird eine `dist/js/modernizr.js`-Datei erzeugt und in die `dist/js/predom.js` integriert.

Wird also bspw. im Sass der Selektor `.no-touchevents {}` oder im JavaScript `if (Modernizr.touchevents) {}` verwendet, muss einmalig `gulp` ausgeführt werden, damit der Modernizr-Task nach Vorkommnissen suchen kann. Danach ist der `touchevents`-Test dann in der `modernizr.js` bzw. `predom.js` integriert und kann beliebig oft genutzt werden.

## Anpassungen am Workflow

Um den Workflow anzupassen oder dessen Komponenten zu aktualisieren, bitte wie folgt verfahren:

1. Repository clonen
2. Anpassungen am Workflow vornehmen
3. Versionsnummer nach [Semver](http://semver.org/) in der `package.json` aktualisieren
4. Änderungen committen
5. Ein Tag mit der Versionsnummer erstellen und pushen
6. Website-Projekt und das [Skeleton-Projekt](https://bitbucket.org/fondofbags/magento-project-skeleton/src/master/src/theme/skin/frontend/fondofbags/custom/package.json?fileviewer=file-view-default) mit der neuen Versionsnummer vom gulp-workflow-Paket in der `package.json` updaten und `npm install` ausführen
7. Im Idealfall auch andere Website-Projekte updaten, um einen ähnlichen Stand überall zu gewährleisten

**Tipp:** Um Anpassungen am Workflow vorzunehmen ist es am Einfachsten, wenn man innerhalb des Website-Projekts, an dem man gerade arbeitet, einen Symlink auf das gulp-workflow-Paket macht. Dazu einmal im gulp-workflow-Verzeichnis `npm link` ausführen und dann im Website-Projekt `npm link gulp-workflow` ausführen. Jetzt sind Änderungen die am Workflow gemacht werden direkt im Website-Projekt nutzbar (das funktioniert manchmal mit Imagemin nicht, dann einfach die imagemin-tasks temporär auskommentieren). Mehr dazu [bei npm](https://docs.npmjs.com/cli/link).

## Umstellen eines bestehenden Projekts

Im Repository [magento-project-skeleton](https://bitbucket.org/fondofbags/magento-project-skeleton/src/master/src/theme/skin/frontend/fondofbags/custom/) und im [pinqponq.com](https://bitbucket.org/fondofbags/pinqponq.com)-Projekt wird dieser Workflow bereits genutzt. Er wird als privates npm-Modul über die jeweilige `package.json` installiert.

Um ein bestehendes Projekt auf den Workflow umzuziehen, sind folgende Schritte erforderlich:

1. Generisches [Gulpfile](https://bitbucket.org/fondofbags/magento-project-skeleton/src/master/src/theme/skin/frontend/fondofbags/custom/gulpfile.js?fileviewer=file-view-default) einsetzen
2. [package.json](https://bitbucket.org/fondofbags/magento-project-skeleton/src/master/src/theme/skin/frontend/fondofbags/custom/package.json?fileviewer=file-view-default) mit den entsprechenden `devDependencies` aktualisieren
3. .editorconfig, .gitattributes und .gitignore aus dem [Skeleton-Projekt](https://bitbucket.org/fondofbags/magento-project-skeleton/src/master?at=master) übernehmen
4. Prüfen ob die Modernizr-Vorkommnisse aktuell sind. Aus `touch` wurde beispielsweise `touchevents`
5. Aktualisiere die `src/theme/app/design/frontend/.../template/page/head.phtml` mit dieser [head.phtml](https://bitbucket.org/fondofbags/magento-project-skeleton/src/master/src/theme/app/design/frontend/fondofbags/custom/template/page/html/head.phtml?at=master&fileviewer=file-view-default). Speziell das Einbinden von CSS und JavaScript ist essenziell.
6. Ziehe alle Komponenten auf die komponentenbasierte Ordner-Struktur um (siehe [Skeleton-Projekt](https://bitbucket.org/fondofbags/magento-project-skeleton/src/master/src/theme/skin/frontend/fondofbags/custom/#markdown-header-komponentenbasierte-entwicklung)
7. Füge eine [gulpconfig.local.js](https://bitbucket.org/fondofbags/magento-project-skeleton/src/master/src/theme/skin/frontend/fondofbags/custom/gulpconfig.local.js?at=master&fileviewer=file-view-default)-Datei hinzu und passe sie entsprechend an (siehe dazu die [gulpconfig.js](https://bitbucket.org/fondofbags/gulp-workflow/src/master/gulpconfig.js?fileviewer=file-view-default))
8. Nenne den Projektordner `.../skin/frontend/fondofbags/[projektname]/` um in `custom` und passe die `modman`-Datei an (Till fragen)
9. Führe `npm install` im Verzeichnis `.../skin/frontend/fondofbags/custom/` aus
10. Führe `gulp build:development` aus
11. Fixe alle Code-Style-Fehler, die von JSHint, JSCS und Sass Lint angemerkt werden (bring Zeit mit)
12. Ziehe die JavaScript-Dateien auf Browserify um (siehe [Skeleton-Projekt](https://bitbucket.org/fondofbags/magento-project-skeleton/src/master/src/theme/skin/frontend/fondofbags/custom/#markdown-header-javascript-browserify))
)
13. Bower soll als Dependency-Manager abgeschafft werden. Ziehe, sofern möglich, die `bower.json` dependencies in die `package.json` um und lösche alle Bower-Vorkommnisse

