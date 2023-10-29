# WebAppTask

#Starten
Zum starten muss die Solution ausgeführt werden (ctrl + F5) und schließend muss der Port, unter welchem der gestartete Server hört, in der app.js gesetzt werden (ganz oben const port = "";).
Anschließend kann die index.hmtl geöffnet werden.

#Testen
Auf der Webseite können Artikel mittels "Neuen Eintrag erstellen" hinzugefügt werden. In der Tabelle können diese Bearbeitet oder gelöscht werden.
Um die Anzahl der HTTP-Anfragen zu reduzieren wird bei den Statuscodes 2xx die Daten lokal gelöscht oder hinzugefügt ohne die gesamte Liste zu aktualisieren.
Oben rechts befindet sich ein "Aktualisieren" Knopf welcher eine GET-Anfrage sendet und eine aktuelle Liste vom Server abruft.
In der Suchleiste kann nach einer ID gesucht bzw gefiltert werden. Bei leerer Eingabe werden wieder alle Einträge gezeigt.

Die Tabellenspalten lassen sich mit einem Klick auf den Spaltenkopf sortieren.
Es öffnet sich ebenfalls das Swagger-UI mit welchem HTTP-requests ausgefürht werden können bzw überprüft werden können.

#Info
Als Framework wurde Vue.js genutzt
