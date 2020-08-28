import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getSingerList () {
  const url = '/api/getSingerList'

  const data = Object.assign({}, commonParams, {
    '-': 'getUCGI' + (Math.random() + '').replace('0.', ''),
    platform: 'yqq.json',
    hostUin: 0,
    needNewCode: 0,
    format: 'json',
    // data: {
    //   comm: { ct: 24, cv: 0 },
    //   singerList: {
    //     module: 'Music.SingerListServer',
    //     method: 'get_singer_list',
    //     param: { area: -100, sex: -100, genre: -100, index: -100, sin: 0, cur_page: 1 }
    //   }
    // },
    data: {
      comm: { ct: 24, cv: 0 },
      singerList: {
        module: 'Music.SingerListServer',
        method: 'get_singer_list',
        param: { area: 200, sex: -100, genre: -100, index: -100, sin: 0, cur_page: 1 }
      }
    }
    // data: {
    //   comm: { ct: 24, cv: 0 },
    //   singerList: {
    //     module: 'Music.SingerListServer',
    //     method: 'get_singer_list',
    //     param: { area: -100, sex: -100, genre: -100, index: -100, sin: 160, cur_page: 3 }
    //   }
    // }

  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSingerDetail (singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })

  return jsonp(url, data, options)
}
