import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController
} from '@ionic/angular';
import { RestService } from '../../service/rest.service';
import { EChartOption } from 'echarts';
import * as echarts from 'echarts';
import { single } from '../../pages/dashboard/graphdata';
import { analyzeAndValidateNgModules } from '@angular/compiler';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage {

  toggleGraph1: boolean = false;
  toggleGraph2: boolean = false;
  toggleGraph3: boolean = false;
  toggleGraph4: boolean = false;
  toggleGraph5: boolean = false;
  toggleGraph6: boolean = false;
  toggleGraph7: boolean = false;
  chartOption: EChartOption
  searchKey = '';
  yourLocation = '123 Test Street';
  themeCover = 'assets/img/ionic4-Start-Theme-cover.jpg';
  name: any;
  selected: any;
  option: any;
  option1: any;
  option2: any;
  option3: any;
  option4: any;
  options: any;
  echarts: any;
  app: any;
  labelOption: any;
  myChart: any;
  require: any

  // demo_html = require('!!html-loader!./hongkong-pd.component.html');
  // demo_ts = require('!!raw-loader!./hongkong-pd.component.ts');

  // show loading spinner:
  mapLoaded = false;
  // empty option before geoJSON loaded:
  // options = {};


  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private rest: RestService,
    private http: HttpClient
  ) {

    this.options = {
      title: {
        // text: 'Total Order Amount Per Month Based on Product Category',
        subtext: 'Number of US Households Streaming OTT Content(CDD)',
        x: 'center',
      },
      color: ['#ff704d', '#00264d', '#66ff66'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        x: 'right',
        orient: 'vertical',
        data: ['March-17', 'March-18', 'March-19']
      },

      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: ['All OTT Devices', 'Streaming Blox Stick', 'Smart TV', 'Casting Control']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'March-17',
          type: 'bar',
          barGap: 0,
          label: this.labelOption,
          data: [320, 332, 301, 334]
        },
        {
          name: 'March-18',
          type: 'bar',
          label: this.labelOption,
          data: [220, 182, 191, 234]
        },
        {
          name: 'March-19',
          type: 'bar',
          label: this.labelOption,
          data: [150, 232, 201, 154]
        },
      ]
    };


    this.option3 = {
      title: {
        // text: '-Total Indents vs Successful indents (Orders) for each month',
        subtext: 'Acceptances',
        x: 'center'
      },
      color: ['#003366', '#006699', '#4cabce', '#e5323e'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      // legend: {
      //   data: ['Forest', 'Steppe', 'Desert', 'Wetland']
      // },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: ['2012', '2013', '2014', '2015', '2016']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Forest',
          type: 'bar',
          barGap: 0,
          label: this.labelOption,
          data: [320, 332, 301, 334, 390]
        },
        {
          name: 'Steppe',
          type: 'bar',
          label: this.labelOption,
          data: [220, 182, 191, 234, 290]
        },
      ]
    };


    this.option1 = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      series: [
        {
          name: 'Access Source',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: 50.3, name: 'Rest of World' },
            { value: 80.3, name: 'Australia' },
            { value: 102.2, name: 'Europe' },
            { value: 220, name: 'North America' },
            // { value: 1548, name: 'search engine' }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };



    // this.app.title = 'Multiple X-axis examples';

    var colors = ['#5793f3', '#d14a61', '#675bba'];


    this.option2 = {
      title: {
        // text: 'Total Order Amount of field agents for the year',
        subtext: 'Overwide list of field agents',
        x: 'center'
      },
      color: colors,

      tooltip: {
        trigger: 'none',
        axisPointer: {
          type: 'cross'
        }
      },
      // legend: {
      //   data: ['2015 Precipitation', '2016 Precipitation']
      // },
      grid: {
        top: 70,
        bottom: 50
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: colors[1]
            }
          },
          axisPointer: {
            label: {
              formatter: function (params) {
                return 'Precipitation  ' + params.value
                  + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
              }
            }
          },
          data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
        },
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: colors[0]
            }
          },
          axisPointer: {
            label: {
              formatter: function (params) {
                return 'Precipitation  ' + params.value
                  + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
              }
            }
          },
          data: ["2015-1", "2015-2", "2015-3", "2015-4", "2015-5", "2015-6", "2015-7", "2015-8", "2015-9", "2015-10", "2015-11", "2015-12"]
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '2015 Precipitation',
          type: 'line',
          xAxisIndex: 1,
          smooth: true,
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
        {
          name: '2015 Precipitation',
          type: 'line',
          smooth: true,
          data: [10.6, 21.9, 18.0, 4.4, 15.7, 62.7, 145.6, 176.2, 31.7, 28.8, 3.0, 9.3]
        },
        {
          name: '2016 Precipitation',
          type: 'line',
          smooth: true,
          data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
        },
        {
          name: '2016 Precipitation',
          type: 'line',
          smooth: true,
          data: [8.9, 12.9, 22.1, 12.7, 32.3, 74.2, 246.6, 52.6, 48.4, 12.4, 18.3, 7.7]
        }
      ]
    };

    function genData(count) {
      var nameList = [
        'zhao', 'money', 'sun', 'Lee', 'week', 'Wu', 'Zheng', 'king', 'Feng', 'Chen', '褚', 'Guard', 'jiang', 'sink', 'Han', 'Yang', 'Zhu', 'Qin', 'Especially', 'Xu', 'What', 'Lu', 'Shi', 'Zhang', 'hole', 'Cao', 'strict', 'China', 'gold', 'Wei', 'pottery', 'ginger', '戚', 'thank', 'Zou', 'Yu', 'Cypress', 'water', 'sinus', 'chapter', 'cloud', 'Su', 'Pan', 'Ge', '奚', 'Fan', 'Peng', 'Lang', 'Lu', 'Wei', 'Chang', 'horse', 'seedling', 'phoenix', 'flower', 'square', 'Yu', 'Ren', 'Yuan', 'willow', '酆', 'abalone', 'history', 'Tang', 'fee', 'inexpensive', '岑', 'Xue', 'mine', 'He', 'Ni', 'soup', 'Teng', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危'
      ];

      function makeWord(max, min) {
        var nameLen = Math.ceil(Math.random() * max + min);
        var name = [];
        for (var i = 0; i < nameLen; i++) {
          name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
        }
        return name.join('');
      }
    }


    Object.assign(this, { single })

    this.chartOption = {
      title: {
        // text: '-Total Order Amount vs Month-Graph',
        subtext: 'Monthly Sales',
        x: 'center'
      },
      xAxis: {
        type: 'category',
        data: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
      }]
    }


    //app.title = 'Align the axis scale with the label';

    this.option = {
      title: {
        // text: 'Total Order Amount Per Month vs Field Agent - Agency Wise - Bar Chart',
        subtext: 'Total Orders Per Month',
        x: 'center'
      },
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // Axis indicator, axis trigger is valid
          type: 'shadow'        // The default is a straight line, optional：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'direct interview',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    };

    // fetch map geo JSON data from server
    this.http.get('assets/data/HK.json')
      .subscribe(geoJson => {
        // hide loading:
        this.mapLoaded = true;
        // register map:
        echarts.registerMap('HK', geoJson);
        // update options:
        this.option4 = {
          title: {
            // text: 'Hong Kongs 18 district population density(2011)',
            subtext: '',
            // sublink: 'http://zh.wikipedia.org/wiki/%E9%A6%99%E6%B8%AF%E8%A1%8C%E6%94%BF%E5%8D%80%E5%8A%83#cite_note-12'
            left: 'right'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>{c} (p / km2)'
          },

          visualMap: {
            min: 800,
            max: 50000,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            orient: 'horizontal',
            inRange: {
              color: ['lightskyblue', 'yellow', 'orangered']
            }
          },
          series: [
            {
              name: 'Hong Kong 18 district population density',
              type: 'map',
              mapType: 'HK', // map type should be registered
              itemStyle: {
                normal: { label: { show: true } },
                emphasis: { label: { show: true } }
              },
              data: [
                { name: 'Alabama', value: 4822023 },
                { name: 'Alaska', value: 731449 },
                { name: 'Arizona', value: 6553255 },
                { name: 'Arkansas', value: 2949131 },
                { name: 'California', value: 38041430 },
                { name: 'Colorado', value: 5187582 },
                { name: 'Connecticut', value: 3590347 },
                { name: 'Delaware', value: 917092 },
                { name: 'District of Columbia', value: 632323 },
                { name: 'Florida', value: 19317568 },
                { name: 'Georgia', value: 9919945 },
                { name: 'Hawaii', value: 1392313 },
                { name: 'Idaho', value: 1595728 },
                { name: 'Illinois', value: 12875255 },
                { name: 'Indiana', value: 6537334 },
                { name: 'Iowa', value: 3074186 },
                { name: 'Kansas', value: 2885905 },
                { name: 'Kentucky', value: 4380415 },
                { name: 'Louisiana', value: 4601893 },
                { name: 'Maine', value: 1329192 },
                { name: 'Maryland', value: 5884563 },
                { name: 'Massachusetts', value: 6646144 },
                { name: 'Michigan', value: 9883360 },
                { name: 'Minnesota', value: 5379139 },
                { name: 'Mississippi', value: 2984926 },
                { name: 'Missouri', value: 6021988 },
                { name: 'Montana', value: 1005141 },
                { name: 'Nebraska', value: 1855525 },
                { name: 'Nevada', value: 2758931 },
                { name: 'New Hampshire', value: 1320718 },
                { name: 'New Jersey', value: 8864590 },
                { name: 'New Mexico', value: 2085538 },
                { name: 'New York', value: 19570261 },
                { name: 'North Carolina', value: 9752073 },
                { name: 'North Dakota', value: 699628 },
                { name: 'Ohio', value: 11544225 },
                { name: 'Oklahoma', value: 3814820 },
                { name: 'Oregon', value: 3899353 },
                { name: 'Pennsylvania', value: 12763536 },
                { name: 'Rhode Island', value: 1050292 },
                { name: 'South Carolina', value: 4723723 },
                { name: 'South Dakota', value: 833354 },
                { name: 'Tennessee', value: 6456243 },
                { name: 'Texas', value: 26059203 },
                { name: 'Utah', value: 2855287 },
                { name: 'Vermont', value: 626011 },
                { name: 'Virginia', value: 8185867 },
                { name: 'Washington', value: 6897012 },
                { name: 'West Virginia', value: 1855413 },
                { name: 'Wisconsin', value: 5726398 },
                { name: 'Wyoming', value: 576412 },
                { name: 'Puerto Rico', value: 3667084 }
              ],
            }
          ]
        };
      });

  }


  async alertLocation() {
    const changeLocation = await this.alertCtrl.create({
      header: 'Change Location',
      message: 'Type your Address.',
      inputs: [
        {
          name: 'location',
          placeholder: 'Enter your new Location',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Change',
          handler: async (data) => {
            console.log('Change clicked', data);
            this.yourLocation = data.location;
            const toast = await this.toastCtrl.create({
              message: 'Location was change successfully',
              duration: 3000,
              position: 'top',
              closeButtonText: 'OK',
              showCloseButton: true
            });

            toast.present();
          }
        }
      ]
    });
    changeLocation.present();
  }
  expand(type) {
    if (type == 'graph1') {
      this.toggleGraph1 = !this.toggleGraph1;
    }
    if (type == 'graph2') {
      this.toggleGraph2 = !this.toggleGraph2;
    }
    if (type == 'graph3') {
      this.toggleGraph3 = !this.toggleGraph3;
    }
    if (type == 'graph4') {
      this.toggleGraph4 = !this.toggleGraph4;
    }
    if (type == 'graph5') {
      this.toggleGraph5 = !this.toggleGraph5;
    }
    if (type == 'graph6') {
      this.toggleGraph6 = !this.toggleGraph6;
    }
    if (type == 'graph7') {
      this.toggleGraph7 = !this.toggleGraph7;
    }
  }

}