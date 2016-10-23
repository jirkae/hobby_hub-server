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
            name: 'Bird watching in Prague ',
            description: 'Let us go hunt some birds in Prague! 11.11.2016 we do diz.',
            detailDescription: 'Owls included.'
          }, {
            name: 'Much-Mush-Rooming v2.0 near Krkonoše! JOIN NOW!',
            description: 'We are looking for big ones only!',
            detailDescription: 'We accept girls too.'
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
