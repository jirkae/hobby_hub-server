'use strict';

module.exports = function(app) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */

  app.dataSources.MongoHobbyHub.autoupdate('Event', (error) => {
    const {Event} = app.models;
    Event.count({}, (err, count) => {
      if (err) {
        console.log("Error while counting Events in db");
      }
      if (count == 0) {
        Event.create([
          {
            name: 'Název eventu',
            description: 'Popis eventu',
            detailDescription: 'Popis eventu detailní',
            category: 'Kategorie1',
            subcategory: 'Subkategorie1',
            participantsMin: 15,
            participantsMax: 15,
            participantsConfirm: true,
            street: 'Bolzanova',
            city: 'Praha',
            zipCode: '850 01',
            startDate: new Date("December 17, 2016 03:24:00"),
            endDate: new Date("December 17, 2016 06:24:00")
          }
        ], (error, data) => {
          if (error) {
            throw error;
          } else {
            console.log("Dummy data created: \n", data)
          }
        })
      }
    })
  })

};
