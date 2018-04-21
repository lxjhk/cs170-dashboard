import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var jQuery: any;
declare var $: any;
declare var moment: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CS170 Algo Results';
  aggregate = {};
  data;
  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get('http://workspace.lxjhk.com:9999/getBestSolutions').subscribe(data => {
      this.data = data;
      console.log(this.data);
      let tags = new Set();


      // get all tages
      for (let input in this.data) {
        for (let tag in this.data[input]) {
          tags.add(tag);
        }
      }
      let tags_array = Array.from(tags.values());


      var dataSet = [];

      for (let input in this.data) {
        var a = [];
        a.push(input);
        for (let tag of tags_array) {
          if (!(tag in this.data[input])) {
            a.push("N.A.");
            a.push("");
            a.push("");

          } else {

            var ptChangeVal = (this.data[input][tag][0] - this.data[input][tags_array[0]][0]) / this.data[input][tags_array[0]][0] * 100;
            var ptChange = ptChangeVal.toFixed(2);
            a.push(this.data[input][tag][0]);

            if (ptChangeVal > 0)
              a.push("<span style=\"color:red;\"><strong>" + ptChange + "% </strong></span>");
            else if (ptChangeVal == 0)
              a.push("<span style=\"color:grey;\">" + ptChange + "% </span>");
            else if (ptChangeVal < 0)
              a.push("<span style=\"color:green;\"><strong>" + ptChange + "% </strong></span>");
            console.log(Math.floor(this.data[input][tag][1]));

            var timestamp = moment.unix(Math.floor(this.data[input][tag][1]));
            a.push(timestamp.format("MM-DD HH:mm:ss"));
          }
        }

        dataSet.push(a);
      }
      console.log(dataSet);

      var cols = [];
      cols.push({ title: "Input" })
      for (let tag of tags_array) {
        cols.push({ title: tag })
        cols.push({ title: "Delta" })
        cols.push({ title: "Time" })
      }

      $('#example').DataTable({
        "scrollX": true,
        data: dataSet,
        paging: false,
        columns: cols
      });

    });

  }

}
