'use strict';
const ACHIEVEMENTS = [
  {id:'01',category:'生活',action:'一个人也好好吃了顿饭',name:'一人食鉴赏家',rank:'SR',description:'没有等谁一起，也认真款待了自己。',skill:'自我款待 +10',icon:'heart',color:'peach'},
  {id:'02',category:'生活',action:'收拾了一个小角落',name:'秩序魔法师',rank:'R',description:'世界还很大，先让这一小块变得舒服。',skill:'清爽半径 +1',icon:'star',color:'mint'},
  {id:'03',category:'生活',action:'给自己倒了一杯水',name:'补水小能手',rank:'R',description:'忙碌的间隙，你记得照顾这具身体。',skill:'关照自己 +10',icon:'drop',color:'lilac'},
  {id:'04',category:'生活',action:'给自己做了点吃的',name:'私人主厨',rank:'SR',description:'不必是大餐，这一口也有你的心意。',skill:'生活热气 +10',icon:'sun',color:'peach'},
  {id:'05',category:'自己',action:'允许自己好好休息',name:'休息特许官',rank:'SSR',description:'今天的暂停，不需要用忙碌来换取。',skill:'放心休息 +10',icon:'moon',color:'lilac'},
  {id:'06',category:'自己',action:'难过时没有责怪自己',name:'温柔接住者',rank:'SSR',description:'状态不好的时候，你也站在了自己这边。',skill:'自我友善 +10',icon:'heart',color:'mint'},
  {id:'07',category:'自己',action:'放下手机，发了会儿呆',name:'云朵观察员',rank:'R',description:'那几分钟没有产出，却完整地属于你。',skill:'留白空间 +10',icon:'cloud',color:'lilac'},
  {id:'08',category:'自己',action:'听完了一首喜欢的歌',name:'情绪调音师',rank:'SR',description:'一首歌的时间，你找回了一点自己的节奏。',skill:'心动音量 +10',icon:'music',color:'peach'},
  {id:'09',category:'勇气',action:'拒绝了一个不想答应的请求',name:'边界守护者',rank:'SSR',description:'这一次，你把自己的意愿也算了进去。',skill:'温柔坚定 +10',icon:'shield',color:'mint'},
  {id:'10',category:'勇气',action:'开始了一件拖了很久的事',name:'启动按钮侠',rank:'SR',description:'不必一口气做完，开始的这一步已经发生。',skill:'启动能量 +10',icon:'bolt',color:'peach'},
  {id:'11',category:'勇气',action:'向别人说出了自己的需要',name:'心声传递员',rank:'SSR',description:'让需要被听见，也是一种照顾自己的方式。',skill:'表达勇气 +10',icon:'spark',color:'lilac'},
  {id:'12',category:'勇气',action:'向一个人表达了感谢',name:'暖意投递员',rank:'R',description:'你把心里那句谢谢，送到了对方手里。',skill:'温暖送达 +1',icon:'heart',color:'peach'},
  {id:'13',category:'探索',action:'绕了一条不常走的路',name:'支线探险家',rank:'SR',description:'熟悉的日常，被你走出了一个小小分岔。',skill:'新鲜视野 +10',icon:'compass',color:'mint'},
  {id:'14',category:'探索',action:'试了一样没尝过的东西',name:'新鲜感捕手',rank:'SR',description:'不必远行，一点没试过的味道也算探索。',skill:'好奇雷达 +10',icon:'spark',color:'lilac'},
  {id:'15',category:'探索',action:'留意到一处好看的风景',name:'微光收藏家',rank:'R',description:'那个容易错过的瞬间，被你认真看见了。',skill:'美好捕获 +1',icon:'sun',color:'peach'},
  {id:'16',category:'探索',action:'出门走了一小会儿',name:'散步自由人',rank:'R',description:'没有非到不可的终点，这段路也属于你。',skill:'自由步数 +10',icon:'leaf',color:'mint'}
];
