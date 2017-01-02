/** @jsx createElement */
import { createElement } from 'elliptical'
import { Command } from 'lacona-phrases'
import { runApplescript } from 'lacona-api'

const scrapeIt = require("scrape-it");

var banned = ["hlavní chod", "polévka:", "kulaj", "houb", "hříbek", "hříbk", "hřib", "žamp", "portobello", "hlív"]

export const MyNewCommand = {
  extends: [Command],

  execute (result) {
    console.log('executing MyNewCommand')
    scrapeIt("http://www.meat-market.cz/bistro/", {
      menu: {
        listItem: ".tweet_list > p",
        data: {
          meal: "span"
        }
      }
    }, (err, data) => {
        data.menu.forEach(function (meal){
          //Conditions
          var isOk = true
          if (meal.meal == "") isOk = false;
          banned.forEach(function(tabu){
            if (meal.meal.toLowerCase().indexOf(tabu) != -1) isOk = false;
          })
          if (isOk) {
            runApplescript({script: `display notification "${meal.meal}"`});
          }
          await sleep(1000);
        });
        console.log(err || data);
    });
  },

  describe () {
    return (
      <literal
        text='presto'
        />
    )
  }
}

export const extensions = [MyNewCommand]

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}