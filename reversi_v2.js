  var drawingSurface;
  var ctxt;

  var delta=10;
  var side = 50; //side of a square, for one pawn

  var dim_x = 8, dim_y=8;// Reversi is played on a 8x8 grid

  var cnt_0=0, cnt_1=0;

  var tabgrid = new Array(dim_x);

  var playerHand = 0; //0=player1, 1=player2 --Player1 goes first

  //8 directions : [-1,-1] UpLeft, [0,-1] Up, [1,-1] UpRight, [-1,0] Left,
  //[1,0] Right, [-1,1] DownLeft, [0,1] Down, [1,1] DownRight
  var directions =  [ [-1,-1], [0,-1], [1,-1], [-1,0], [1,0], [-1,1], [0,1], [1,1] ]

  function getColor(playerId)
  {
    return playerId==0?"black":"red"; //0=player1, 1=player2
  }

  function initTabGrid()
  {
    for(i=0;i<dim_x;i++)
    {
      tabgrid[i]=new Array(dim_y);

      for(j=0;j<dim_y;j++)
      {
        tabgrid[i][j] = -1;
      }
    }

  }

  function Pawn()
  {

  }

  function Pawn(pos, playerId)
  {
    this.posx = pos.x;
    this.posy = pos.y;
    this.playerId = playerId==0?0:1;

    this.play  = function Play(){
      tabgrid[this.posx][this.posy] = this.playerId;

      updateCounterForPlayerX(this.playerId,1);

      ctxt.beginPath();
      ctxt.clearRect(delta+this.posx*side+delta/4,delta+this.posy*side+delta/4, side-delta/2, side-delta/2);
      ctxt.arc(delta+this.posx*side + side/2,delta+this.posy*side + side/2,side/2-delta,0, 2 * Math.PI, true);
      ctxt.fillStyle = getColor(this.playerId);
      ctxt.fill();
      ctxt.stroke();
    }

    this.chgColor = function ChgColor(){
      updateCounterForPlayerX(this.playerId, -1);
      this.playerId =  (++this.playerId)%2;
      this.play();
    }

    this.chkDirection = function ChkDirection(Direction, counter, chgOnly)
    {
      //chkOnly=true, means search for possible plays only
      //when chkOnly=false, means search for possible plays and perform change

      //recursive function.. counter starts at zero, in first call
      var pos = {
        x : this.posx+Direction.x,
        y : this.posy+Direction.y
      }

      if(pos.x<0 ||
        pos.x>=dim_x || pos.y<0 || pos.y>=dim_y || tabgrid[pos.x][pos.y]===-1)
      {
        //alert('1');
        return 0;
      }

      if(tabgrid[pos.x][pos.y]===Direction.p && counter===0)
      {
        //alert('2');
        return 0;
      }

      if(tabgrid[pos.x][pos.y]===Direction.p && counter>0)
      {
        //alert('3');
        //this.play();
        return 1;
      }

      if(tabgrid[pos.x][pos.y]!=Direction.p)
      {
        //alert('4');
        var p = new Pawn(pos, (Direction.p+1)%2);
        var result = p.chkDirection(Direction, ++counter, chgOnly);
        if(result==1)
          {
            if(!chgOnly)p.chgColor();
            return 1;
          }

      }


      //alert(tabgrid[this.posx][this.posy]+' next->'+tabgrid[x][y]);
    }
  }

  function updateCounterForPlayerX(p, value)
  {
    //value=1 mean increase or value=-1 mean decrease
    if(p==0)
      cnt_0 = cnt_0 + value;
    else
      cnt_1 = cnt_1 + value;
  }

  function grid(coord)
  {
    li = coord.x;
    col = coord.y;

    ctxt.beginPath();
    //create grid
    for(i=0;i<col; i++)
    {
      for (j=0; j<li; j++)
      {
        ctxt.rect(delta+j*side,delta+i*side,side,side);
      }
    }
    ctxt.stroke();

    initTabGrid();

    //initial pawns
    var p1 = new Pawn( {x:3,y:3}, 0);
    p1.play();
    var p2 = new Pawn( {x:4,y:3}, 1);
    p2.play();
    var p3 = new Pawn( {x:4,y:4}, 0);
    p3.play();
    var p4 = new Pawn( {x:3,y:4}, 1);
    p4.play();

    //printInfo('Score: Player 1='+cnt_0+' ... Player 2='+cnt_1, 0);
    printInfo('Score: Player 1='+cnt_0+' ... Player 2='+cnt_1+'! Hand to Player '+(playerHand+1), 0);

    ctxt.canvas.addEventListener("mousedown", function(evt){

      var coord = getPosition(evt);

      var pos = {
        x : mapping(coord.x,delta,side),
        y : mapping(coord.y,delta,side)
      }

      //check if position is not empty
      if(tabgrid[pos.x][pos.y]!=-1)
      {
        //printInfo('This is not a valid play! Hand to Player '+(playerHand+1), 1);
        return;
      }

      var p = new Pawn( pos, playerHand);

      var validPlay = false;
      //look in all directions, check for a valid play
      //8 directions : [-1,-1] UpLeft, [0,-1] Up, [1,-1] UpRight, [-1,0] Left,
      //[1,0] Right, [-1,1] DownLeft, [0,1] Down, [1,1] DownRight
      for(i=0;i<directions.length;i++)
      {
        if(p.chkDirection(
          {
            x:directions[i][0],
            y:directions[i][1],
            p:playerHand
          },0, false) === 1)
          {
            validPlay=true;
          }
      }

      if(validPlay)
      {
        p.play();

        playerHand = (++playerHand)%2;

        decision()

      }
      else
      {
        printInfo('This is not a valid play! Hand to Player '+(playerHand+1), 1);

        decision();

        return;
      }



    }, false);

  }

  function decision()
  {
    if(checkAvailablePlays(playerHand))
    {
      printInfo('Score: Player 1='+cnt_0+' ... Player 2='+cnt_1+'! Hand to Player '+(playerHand+1), 0);
    }
    else
    {

      playerHand = (++playerHand)%2;

      if(checkAvailablePlays(playerHand))
      {
        printInfo('Score: Player 1='+cnt_0+' ... Player 2='+cnt_1+
        '! No available play for Player'+((playerHand+1)%2 + 1)+', Hand to Player '+(playerHand+1), 0);
      }else
      {
        //game over
        var tmp = (cnt_0>cnt_1)?0:((cnt_0<cnt_1)?1:-1);
        switch(tmp)
        {
          case 0:
          printInfo('Score: Player 1='+cnt_0+' ... Player 2='+cnt_1+'! Player 1 wins!!!', 0);
          break;
          case 1:
          printInfo('Score: Player 1='+cnt_0+' ... Player 2='+cnt_1+'! Player 2 wins!!!', 0);
          break;
          default:
          printInfo('Score: Player 1='+cnt_0+' ... Player 2='+cnt_1+'! Game over/Tie Game!!!', 0);
        }

      }

    }
  }

  function check(value, index, array, p)
  {
    //if(value!=-1)return;

    alert(p);

    return;
/*
    var p = new Pawn({x:i,y:index}, pawn)

    //check/scan in all directions, once we find an available play, return true
    for(a=0;a<directions.length;a++)
    {
      if(pawn.chkDirection(
        {
          x:directions[a][0],
          y:directions[a][1],
          p:playerHand
        },0, true) === 1)
        {
          return true;
        }
    }

    return false;*/

  }

  function checkAvailablePlays(pawn)
  {

  /*  for(i=0;i<dim_x;i++)
         if(tabgrid[i].forEach();
            return true;
         else
          continue;*/




    for(i=0;i<dim_x;i++)
    {
      for(j=0;j<dim_y;j++)
      {
        //alert(tabgrid[i][j]);
        if(tabgrid[i][j]!=-1)continue;
        //alert('test');
        var pawn = new Pawn({x:i,y:j}, pawn)

        //check/scan in all directions, once we find an available play, return true
        for(a=0;a<directions.length;a++)
        {
          if(pawn.chkDirection(
            {
              x:directions[a][0],
              y:directions[a][1],
              p:playerHand
            },0, true) === 1)
            {
              return true;
            }
        }


      }
    }

    return false;
  }

  function printInfo(str, type)
  {
    //type=1: red for alert information, type=0: blue for normal information
    //type default: black for any other information
    var msg = document.getElementById("msgArea");

    switch(type)
    {
      case 0:
      msg.style.color= "blue";
      break;
      case 1:
      msg.style.color="red";
      break;
      default:
      msg.style.color="black";
    }

    msg.textContent = str;
  }

  function getPosition(evt)
  {
    var rect = ctxt.canvas.getBoundingClientRect();

    return{
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };

  }

  function mapping(coord, delta, side)
  {
    return Math.ceil((coord - delta)/side) - 1;
  }

  window.onload = function () {

    var drawingSurface = document.getElementById("drawingSurface");

    ctxt = drawingSurface.getContext("2d");

    grid({x:dim_x, y:dim_y});

  }
