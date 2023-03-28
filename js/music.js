window.onload = function (){
    let oUlElement = document.querySelector('.oUl')
    let imgElements= [...oUlElement.querySelectorAll('img')]
    let btnElements = [...document.querySelectorAll('.btn')]
    let progress2Element = document.querySelector('.progress2')
    let stopBtn = document.querySelector('#stop_btn')

    //初始化的每一张图片的位置，0-1之间的值，0为最低为，1为最高位
    let initRatio = [1, .4 , 0, .4, .6, .4, 0]
    //为0时的最低值
    let bassRatioPosition = oUlElement.clientHeight *.8

    // 随机颜色数组
    let colors = [
        '#ff5f5b',
        '#ffb66e',
        '#ffd96d',
        '#e8f898',
        '#8cf6f3',
        '#92aef0',
        '#b897e4'
    ]
    let color = ''

    let musicList = [
        './resource/mo.mp3',
        './resource/Rihanna - Only Girl (In The World).mp3',
        './resource/Remix.mp3',
        './resource/Neptune Illusion Dennis Kuo .mp3'
    ]
    
    let audio = null
    let audioContext = null
    let sourceNode = null
    let analyser = null

    let currentBtn = null

    imgElements.forEach( (img,index) => {
        let {x} = img.getBoundingClientRect()
        img._centerPointer = {
            x: x + img.width / 2
        }

        setTransform(img, 'translateY', getTranslateByRatio(initRatio[index]))
    })

    // animatePhone(initRatio)

    oUlElement.onmouseover = function({clientX}){
        let vals = imgElements.map((img, index) => {
          return 1 - Math.abs(clientX - img._centerPointer.x) / window.innerWidth
        })
        animatePhone(vals)
    }
    oUlElement.onmouseleave = function(){
        animatePhone(initRatio);
    }

    //遍历手机的位置
    function animatePhone(ratio){
        imgElements.forEach((img, index) => {
            // img.style.transform = `translateY(${
            //     getTranslateByRatio(ratio[index])
            // }px)`

            mTween.stop(img)
            mTween({
                el:img,
                attr:{
                    translateY: getTranslateByRatio(ratio[index])
                }
            })
        } )
    }

    function getTranslateByRatio(ratio){
        return (1 - ratio) * bassRatioPosition
    }

    // 按钮
    btnElements.forEach( (btn, index) => {
        btn.onclick = function() {

            color = colors[Math.floor(Math.random() * colors.length)];

            currentBtn && mTween.stop(currentBtn);

            btnElements.forEach(btn => btn.style = '');
            btn.style.backgroundColor = color;
            btn.style.color = 'white';

            currentBtn = this;

            if (audio) {
                audio.pause();
                audio = null;
            }
            audio = new Audio();
            audio.addEventListener('canplay', play);
            audio.src = musicList[index];
        }
    } )

    //停止
    stopBtn.onclick = function (){
        audio.pause()
    }

    function play(){
        audio.play()
        
        audioContext = new AudioContext()

        sourceNode = audioContext.createMediaElementSource(audio)

        analyser = audioContext.createAnalyser()

        sourceNode.connect(analyser)

        analyser.connect(audioContext.destination)

        parse()

    }

    function parse(){
        let freqUnit = []
        let freqArray = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(freqArray)

        //设置步长
        let step = Math.round(freqArray.length / 7)
        for (let i = 0; i < 7; i++) {
            freqUnit.push(freqArray[i * step] / bassRatioPosition)
            
        }
        animatePhone(freqUnit)
        console.log(freqUnit);
        if(!audio.paused){
            requestAnimationFrame(parse)
        } 
    }
    //敏感词汇替换 
    function wordReplace(str, replaceArr){
        let replaceReg = replaceArr.split(',')
        let res = str.replace(replaceReg,function(arg){
            return "*".repeat(arg.length)
        })
    }

    // let str1 ="this knife is 5KM"
    // let reg = /[KkCc]?[Mm]/
    // let res = str1.replace(reg,'米')
    // console.log(res);

    // . => [^\r\n];  \d => [0-9]
    // \w => [a-zA-Z_0-9]

    //边界 \b 非 \w 都被称为边界
    // let str2 = "is this a book?" 
    // let reg = /\bis\b/g
    
    // console.log(str2.match(reg));
    //反向引用
    let time = "2021-06-09 23:00"//09/06/2021 23:00
    let reg = /(\d{4})-(\d{1,2})-(\d{1,2}) (\d{2}):(\d{2})/
    let res = time.replace(reg, "$3/$2/$1 $4.$5")
    console.log(res);
}
