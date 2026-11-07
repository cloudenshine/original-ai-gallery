(function(root){
  const lessons={
    bone:{id:'bone',number:'01',title:'三块骨，一处相遇',eyebrow:'BONES / 骨骼',text:'股骨与胫骨形成膝部主要连接，髌骨位于前方。先建立空间位置，再认识软组织。',note:'此处是原创二维关系示意，不是 Anatomy 的 3D 模型，也不是按比例绘制。',visible:['femur','tibia','patella'],question:'哪块骨通常被称作“膝盖骨”？',answer:'patella',explain:'髌骨位于膝部前方。真实形态与位置请在 Anatomy 场景中旋转观察。'},
    meniscus:{id:'meniscus',number:'02',title:'骨之间，还有一层',eyebrow:'MENISCI / 半月板',text:'内、外侧半月板位于股骨与胫骨之间，帮助分散负荷并稳定关节。半月板与覆盖骨端的关节软骨不是同一结构。',note:'示意图把左右半月板并列展开，便于理解关系；没有呈现完整断面或真实厚度。',visible:['femur','tibia','menisci'],question:'哪一组结构位于股骨和胫骨之间？',answer:'menisci',explain:'答案是内、外侧半月板。原生 Anatomy 第二步可隐藏骨骼查看。'},
    muscle:{id:'muscle',number:'03',title:'让结构进入运动',eyebrow:'MUSCLE / 股四头肌',text:'大腿前侧股四头肌参与伸膝，肌腱将肌肉力量传向骨骼。此图仅画出关系，不用于测量力、应力或肌肉激活。',note:'在 Anatomy 第四步播放下蹲，并暂停观察。下蹲是多个关节共同参与的动作，不能由这一幅示意图判断训练是否安全。',visible:['femur','tibia','patella','muscle'],question:'图中哪一类结构主动产生拉力？',answer:'muscle',explain:'肌肉收缩产生拉力，经肌腱传递。Anatomy 的动画为手设角度示意，不是生物力学计算。'}
  };
  const api={lesson:id=>lessons[id]||lessons.bone,checkAnswer:(id,choice)=>{const l=lessons[id]||lessons.bone;return {correct:l.answer===choice,explanation:l.explain};}};
  if(typeof module!=='undefined')module.exports=api;else root.KneeLearning=api;
})(typeof window==='undefined'?globalThis:window);
