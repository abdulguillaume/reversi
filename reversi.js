var drawingSurface;
var ctxt;

var delta=10;
var side = 50;

var player = 0;

var color1="blue";
var color2="yellow";

var score1=2;
var score2=2;

var tabgrid = [

  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,0,1,-1,-1,-1],
  [-1,-1,-1,1,0,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1]

];

var hi = [-1,0,1,-1,1,-1,0,1];
var vi = [-1,-1,-1,0,0,1,1,1];

  function pawn(canvas, x, y, color)
  {
    ctxt = canvas.getContext("2d");
    ctxt.beginPath();
    //ctxt.rect(20,40,side,side);
    ctxt.clearRect(delta+x*side+delta/4,delta+y*side+delta/4, side-delta/2, side-delta/2);
    ctxt.arc(delta+x*side + side/2,delta+y*side + side/2,side/2-delta,0, 2 * Math.PI, true);
    //ctxt.lineWidth = 25;
    //ctxt.strokeStyle = color;
    ctxt.fillStyle = color;
    ctxt.fill();
    ctxt.stroke();
    //ctxt.closePath();

  }

  function rec_scan(x, y, p, d, step)
  {

    //var sum=0;

    switch(d)
    {
      case -1://scan all directions

      for(i=0;i<8;i++)
      {
        //alert(x + ' '+ y);
        if(rec_scan(x+hi[i], y+vi[i], p, i, 0)==1)
        {return 1;}
        //alert(sum);
        //if(sum>0) return 1;
      }
      break;

      default://any direction

      if(x<0 || x>7 || y<0 || y>7) return 0;

      //alert(step + ' ' + x + ' '+ y + ' ' + tabgrid[x][y]);
      if(tabgrid[x][y] == -1)
      {
        return 0;
      }
      else if (tabgrid[x][y]!=p) {
        //alert('test 1');
        return rec_scan(x+hi[d], y+vi[d], p, d, ++step);
      }
      else if(tabgrid[x][y]==p && step>0)
      {
        alert("youpiii");
        return 1;
      }


    }

    return 0;


  }

  function change(canvas, x, y, a, h, v, p)
  {
    //witness of change
    var woc = 0;

    for(i=1; i<a; i++)
    {
      tabgrid[x+h*i][y+v*i] = p;

      if(p==0)
      {
        score1++;
        score2--;
      }
      else {
        score2++;
        score1--;
      }

      pawn(canvas, x+h*i, y+v*i, p==0?color1:color2);
      woc = 1;
    }

    return woc;

  }

  function scan4change(canvas, x, y, h, v, p)
  {

    if(p == -1 || (h==0 && v==0)) return 0;

    var chg=0;

    //var str = p;

    var current_pawn = p;

    for(i=1; (x+h*i<8 && x+h*i>=0) && (y+v*i<8 && y+v*i>=0); i++)
    {
      var scan_pawn = tabgrid[x+h*i][y+v*i];

      if(scan_pawn == -1)
      {
        break;
      }
      else if(scan_pawn != current_pawn)
      {
        continue;
      }


        chg = change(canvas, x,y, i, h, v, p);

        return chg;

    }

    return chg;

  }

  function grid(canvas, li, col)
  {
    ctxt = canvas.getContext("2d");

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

    new Pawn(canvas, 3, 3,"blue");
    //tabgrid[3][3]==0?color1:color2);
    //pawn(canvas, 3, 4, tabgrid[3][4]==0?color1:color2);
    //pawn(canvas, 4, 3, tabgrid[4][3]==0?color1:color2);
    //pawn(canvas, 4, 4, tabgrid[4][4]==0?color1:color2);

    //info('');
    /*
    canvas.addEventListener("mousedown", function(evt){

      var mousePos =  getPosition(canvas, evt);

      var msg =  document.getElementById("mouseXY");

      var x = mapping(mousePos.x,delta,side);
      var y = mapping(mousePos.y,delta,side);

      //msg.textContent = 'Test: 'rec_scan(x,y,player,-1,0)

      if(tabgrid[x][y] == -1 )
      {
        var foundOne = 0;
        //scan in all directions
        for(h=-1;h<2;h++)
        {
          for(v=-1;v<2;v++)
          {
            foundOne = foundOne + scan4change(canvas, x, y, h, v, player);
          }
        }

        //alert(foundOne);

        if(foundOne>0)
        {
          pawn(canvas, x, y, player==0?color1:color2);

          if(player==0)
          {
            score1++;
          }else {
            score2++;
          }

          var tem=player;

          tabgrid[x][y] = player++;

          player = player%2;

          if(score2==0 || score1==0)
          {
            info('Game over. P'+(tem+1)+' wins! - P1='+score1+' P2='+score2);
          }
          else if(score2+score1==64)
          {
            if(score1>score2)
            {
              info('Game over. P1 wins! - P1='+score1+' P2='+score2);
            }
            else if(score1<score2)
            {
              info('Game over. P2 wins! - P1='+score1+' P2='+score2);
            }
            else {
              info('Game over. Tie game!');
            }
          }
          else{
            //alert('test');
            info('');
          }


        }

      }

      alert(check_all_possibilities(player));
      //alert(temp2);

      msg.textContent = 'Mouse position: ' + x
      + ',' + y;




    }, false);
    */
  //}

  function getPosition(canvas, evt)
  {
    var rect = canvas.getBoundingClientRect();

    return{
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };

  }

  function initTable()
  {
    for(i=0;i<8;i++)
    {
      for(j=0;j<8;j++)
      {
        tabgrid[i][j] = -1;
      }
    }

    tabgrid[3][3] =0;
    tabgrid[3][4] =1;
    tabgrid[4][3] =1;
    tabgrid[4][4] =0;

    score1=2;
    score2=2;

    document.getElementById("mouseXY").textContent="";

  }

  function reset()
  {
    ctxt.clearRect(5,5, 415, 415);
    var drawingSurface = document.getElementById("drawingSurface");

    initTable();

    grid(drawingSurface, 8,8);

    player = 0;

    info('');
  }

  window.onload = function () {

    var drawingSurface = document.getElementById("drawingSurface");
    grid(drawingSurface, 8,8);

  }
