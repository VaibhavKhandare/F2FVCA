var peervids=[];
  var xoxarray = [1,2,3,4,5,6,7,8,9];
  var opid;
    const gamereset=()=>{
    for(let i=1;i<10;i+=1){
      document.getElementById("xox" + i).textContent=""
    }
  }
  const addmine =(stream)=>{
      var buttonvid =document.createElement("buttonvideo")
      buttonvid.appendChild(document.createTextNode("Video"));
      buttonvid.classList.add("sbtn")
      document.getElementById("videostatus").textContent = (stream.getVideoTracks()[0].enabled ? "ON" : "OFF")
      buttonvid.onclick=()=>{
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled 
        document.getElementById("videostatus").textContent = (stream.getVideoTracks()[0].enabled ? "ON" : "OFF")
      }
      document.getElementById("videobutton").append(buttonvid)
      var buttonmic = document.createElement("buttonmic")
      buttonmic.appendChild(document.createTextNode("Mic")
      )
      buttonmic.classList.add("sbtn")
      document.getElementById("audiostatus").textContent = (stream.getAudioTracks()[0].enabled ? "ON" : "OFF")
      buttonmic.onclick=()=>{
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled
        document.getElementById("audiostatus").textContent = (stream.getAudioTracks()[0].enabled ? "ON" : "OFF")
      }
      document.getElementById("audiobutton").append(buttonmic)
      var video = document.createElement("video")
      video.classList.add("video")
      video.srcObject = stream;
      video.play()
      video.muted=true
      document.getElementById("grids").append(video) 
    }
  window.addEventListener('load',(event)=>{
    var peer = new Peer()
    var conn = [];
    peer.on('open',(id)=>{
      document.getElementById("peer").textContent = id+" "
      myid = id;
     })
    var avlpeer=[]
    var videoofpeer = false
    var myvideo = true
    var mystream = undefined
    var avlstream = {}    
    // console.log(mystream)
    var getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;      
    getUserMedia({video:true,audio:true})
    .then((stream)=>{
      mystream = stream;
      if(mystream)
      addmine(mystream) 
      }).catch((e)=>{console.log(e.message)})
    var myid
    var allcon= []
    var called = []
    const charmaker=(i)=>{
      // console.log(i,typeof(i))
      if(i==0){
        document.getElementById("xox1").textContent="O"
      }else if(i==1){
        document.getElementById("xox2").textContent="O"
      }else if(i==2){
        document.getElementById("xox3").textContent="O"
      }else if(i==3){
        document.getElementById("xox4").textContent="O"
      }else if(i==4){
        document.getElementById("xox5").textContent="O"
      }else if(i==5){
        document.getElementById("xox6").textContent="O"
      }else if(i==6){
        document.getElementById("xox7").textContent="O"
      }else if(i==7){
        document.getElementById("xox8").textContent="O"
      }else if(i==8){
        document.getElementById("xox9").textContent="O"
      }
    }
    peer.on('connection', function(conn) {
    conn.on('open', function() {
			// Receive messages
			conn.on('data', function(data) {
				// console.log('Received', data);
                if(data[0]==" "){
                  var txt = document.createElement("txt")
                  txt.appendChild(document.createTextNode(data))
                  document.getElementById("allmessages").append(txt)
                }
                else if(data[0]=="*"){
                  var txt = document.createElement("txt")
                  txt.appendChild(document.createTextNode(data))
                  document.getElementById("allmessages").append(txt)
                  xoxarray = [1,2,3,4,5,6,7,8,9];
                  opid = data.substr(1,36)
                  document.getElementById("mulstatus").textContent="Opponent Turn"
                  gamereset()
                }
                else if(data[0]=="-"){
                  if(data[1]=='-'){
                    xoxarray[data[2]-0] = "O";
                    charmaker(data[2]-0)
                    document.getElementById("mulstatus").textContent="Opponent Wins"
                  }
                  else{
                    xoxarray[data[1]-0] = "O";
                    charmaker(data[1]-0)
                    document.getElementById("mulstatus").textContent="Your Turn"
                  }
                }
                else if(typeof(data)!='object'){
                    if(!allcon.includes(data)){
                        allcon.push(data)
                        // console.log(allcon)
                        sendstream([data]);
                        sendall(allcon);
                    }
                }else{
                    sendstream(data);
                }
			});			
			// Send messages 
		});
	});
  peer.on('call',(call)=>{
    call.on('stream',(stream)=>{
      if(!called.includes(call.peer)){
        if(!peervids.includes(call.peer)){
              document.getElementById("status").textContent = call.peer + " Joined"
              var txt = document.createElement("txt")
              txt.appendChild(document.createTextNode(call.peer + " Joined"))
              document.getElementById("allmessages").append(txt)
              remotevideoadder(stream,call.peer)
              peervids.push(call.peer)
            }
        called.push(call.peer)
    }
    })
    call.answer(mystream)
  })
    const sendall = (allcon)=>{      
        allcon.map((i)=>{
            var conn = peer.connect(i);
            conn.on('open',function(){conn.send(allcon)})
        })
    }
    const sendstream=(allcon)=>{
      allcon.map((i)=>{
        if(i!=myid && !called.includes(i)){
          // console.log(i)
          var calling = peer.call(i,mystream)
          calling.on('stream',(stream)=>{
            if(!peervids.includes(calling.peer)){
    document.getElementById("status").textContent =   calling.peer+" Joined"
    var txt = document.createElement("txt")
              txt.appendChild(document.createTextNode(  calling.peer+" Joined"))
              document.getElementById("allmessages").append(txt)
              remotevideoadder(stream,calling.peer)
              peervids.push(calling.peer)
            }
          })
          called.push(i)
        }
      }
      )
    }
    const callpeer=(id)=>{
        var conn = peer.connect(id);
		conn.on('open', function() {
			conn.send(myid);
		});	
    }
    const remotevideoadder=(stream,id)=>{
      var video = document.createElement("video")
      video.classList.add("video")
      video.srcObject = stream;
      video.play()
      document.getElementById("grids").append(video)
    }
    
    document.getElementById("sendmsg").addEventListener('click',(e)=>{
      var msg = document.getElementById("messagetype").value
      // console.log("clicked")
      if(msg!==""){
        document.getElementById("messagetype").value = "";
        var txt = document.createElement("txt")
        txt.appendChild(document.createTextNode("You: " + msg))
        document.getElementById("allmessages").append(txt)
        // console.log(peervids)
        peervids.map(i=>{
          var conn = peer.connect(i);
          conn.on('open',function(){conn.send(" " + myid +": "+msg )})
        })
      }  
  })
    document.getElementById("copy").addEventListener('click',(e)=>{
      navigator.clipboard.writeText(myid);
      document.getElementById("copystatus").textContent = " Copied"
  })
    document.getElementById("callpeer").addEventListener('click',(e)=>{
    var otherpeer=document.getElementById("callingid").value
    document.getElementById("status").textContent = "connecting to " + otherpeer
    callpeer(otherpeer)
  })
  
  document.getElementById("conplayer").addEventListener('click',(e)=>{
    var msg = document.getElementById("playerid").value
      // console.log("clicked")
      if(msg!==""){
        var conn = peer.connect(msg);
        conn.on('open',function(){conn.send("*" + myid+" connected to play" )})
        opid = msg;
        document.getElementById("mulstatus").textContent="Your Turn"
        xoxarray = [1,2,3,4,5,6,7,8,9];
        gamereset()
      }
  })
  const winsender=(i)=>{
    var conn = peer.connect(opid);
    conn.on('open',function(){conn.send("--" + i)})
    document.getElementById("mulstatus").textContent="You Win"
  }
  const xoxchecker=(arr,i)=>{
    // console.log(arr);
    if(arr[0]==arr[1] && arr[1]==arr[2]){
      winsender(i)
    }
    else if(arr[3]==arr[4] && arr[4]==arr[5]){
      winsender(i)
    }
    else if(arr[6]==arr[7] && arr[7]==arr[8]){
      winsender(i)
    }
    else if(arr[0]==arr[3] && arr[3]==arr[6]){
      winsender(i)
    }
    else if(arr[1]==arr[4] && arr[4]==arr[7]){
      winsender(i)
    }
    else if(arr[2]==arr[5] && arr[5]==arr[8]){
      winsender(i)
    }
    else if(arr[0]==arr[4] && arr[4]==arr[8]){
      winsender(i)
    }
    else if(arr[2]==arr[4] && arr[4]==arr[6]){
      winsender(i)
    }else{
      var conn = peer.connect(opid);
      conn.on('open',function(){conn.send("-" + i)})
      document.getElementById("mulstatus").textContent="Opponent Turn"
    }
  }
  const myturn=(i)=>{
    document.getElementById("xox"+(i+1)).textContent="X";
    xoxarray[i]="X";
    xoxchecker(xoxarray,i)
  }
  document.getElementById("xox1").addEventListener('click',(e)=>{if(document.getElementById("mulstatus").textContent=="Your Turn"){if(document.getElementById("xox1").textContent==""){myturn(0);}}})
  document.getElementById("xox2").addEventListener('click',(e)=>{if(document.getElementById("mulstatus").textContent=="Your Turn"){if(document.getElementById("xox2").textContent==""){myturn(1);}}})
  document.getElementById("xox3").addEventListener('click',(e)=>{if(document.getElementById("mulstatus").textContent=="Your Turn"){if(document.getElementById("xox3").textContent==""){myturn(2);}}})
  document.getElementById("xox4").addEventListener('click',(e)=>{if(document.getElementById("mulstatus").textContent=="Your Turn"){if(document.getElementById("xox4").textContent==""){myturn(3);}}})
  document.getElementById("xox5").addEventListener('click',(e)=>{if(document.getElementById("mulstatus").textContent=="Your Turn"){if(document.getElementById("xox5").textContent==""){myturn(4);}}})
  document.getElementById("xox6").addEventListener('click',(e)=>{if(document.getElementById("mulstatus").textContent=="Your Turn"){if(document.getElementById("xox6").textContent==""){myturn(5);}}})
  document.getElementById("xox7").addEventListener('click',(e)=>{if(document.getElementById("mulstatus").textContent=="Your Turn"){if(document.getElementById("xox7").textContent==""){myturn(6);}}})
  document.getElementById("xox8").addEventListener('click',(e)=>{if(document.getElementById("mulstatus").textContent=="Your Turn"){if(document.getElementById("xox8").textContent==""){myturn(7);}}})
  document.getElementById("xox9").addEventListener('click',(e)=>{if(document.getElementById("mulstatus").textContent=="Your Turn"){if(document.getElementById("xox9").textContent==""){myturn(8);}}})

  
  
// })
  })