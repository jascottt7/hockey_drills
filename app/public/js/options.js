
    paper.install(window);
    
    var forward;
    var straight;
    var pencil;
    var pattern1;
    var pass;
    var select_tool;
    var shoot;
    var stickhandle;
    var save_tool;
    var clear_tool;
  
    window.onload = function() {
      paper.setup('sketx-canvas');

      document.getElementById('reset').onclick = function(){

            paper.project.activeLayer.removeChildren();
            paper.view.draw();

        } 

        document.getElementById('upload').onclick = function(){
                var canvas = document.getElementById("sketx-canvas");
                var dataURL = canvas.toDataURL("image/png");
                document.getElementById('name').value = dataURL;
               } 
   
      //************Forward Tool ***********// 
      forward = new Tool();
      var pathforward;
      forward.onMouseDown = function(event) {
      // Create a new path and set its stroke color to black:
        pathforward = new Path({
          segments: [event.point],
          strokeColor: 'black',
          strokeWidth: 4,
          // if we want dashed lines use dashArray: [2, 4],                
        });                            
      }

      // While the user drags the mouse, points are added to the path
      // at the position of the mouse:
      forward.onMouseDrag = function(event) {
        pathforward.add(event.middlePoint);
      }     

      // When the mouse is released, we simplify the path and add arrow:
      forward.onMouseUp = function(event) {
        pathforward.simplify(50); 
        var point = pathforward.getPointAt(pathforward.length)
        var vector  = point.subtract(pathforward.getPointAt(pathforward.length-2)); 
        var arrowVector = vector.normalize(10);
        var path2 = new Path({
          segments: [point.add(arrowVector.rotate(145)), point, point.add(arrowVector.rotate(-145))],
          //fillColor: 'red',
          strokeColor: 'black',
          strokeWidth: 6,              
        }); 
        var pathremove = pathforward.split(pathforward.length - 5);
        pathremove.remove();
        var group = new Group({
        children: [pathforward, path2]
        });
        var raster = group.rasterize();
        group.remove();
      }  
        
      //******** Pencil Tool *******/   
      pencil = new Tool();
      var path;
      pencil.onMouseDown = function(event) {
        if (path) {
          path.selected = false;
        }

        path = new Path({
          strokeColor: '#000',
          strokeWidth: 2
        });
      }

      pencil.onMouseDrag = function(event) {
        path.add(event.point);
      }

      pencil.onMouseUp = function(event) {
        path.simplify(10);  
        var raster = path.rasterize();
        path.remove();             
      }
        
      //****************** Backward Tool ********/
      pattern1 = new Tool();
      pattern1.minDistance = 12;
      pattern1.maxDistance = 12;
      pattern1.onMouseDown = function(event) {
        path = new Path();
        path.strokeColor = 'black';
        path.add(event.point);
        path2 = new Path();
        path2.strokeColor = 'black';
        path2.add(event.point);
        path3 = new Path();
        path3.strokeColor = 'white';
        path3.add(event.point);
        path3.strokeWidth = 8;
        var myCircle = new Path.Circle({
          center: event.point,
          radius: 8,
        });
        }

        pattern1.onMouseDrag = function(event) {
          var step = event.delta;
          step.angle += 90;
          step.normalize(1);
          var top = event.lastPoint.add(step.divide(65));
          var bottom = event.middlePoint.subtract(step.divide(65));
          path.arcTo(top, false);
          path2.arcTo(bottom);
          path3.add(event.point);
        }

        // When the mouse is released, we simplify the path and add arrow:
        pattern1.onMouseUp = function(event) {
          var point = path3.getPointAt(path3.length)
          var vector  = point.subtract(path3.getPointAt(path3.length-20)); 
          var arrowVector = vector.normalize(14);
          var path4 = new Path({
            segments: [point.add(arrowVector.rotate(155)), point, point.add(arrowVector.rotate(-155))],
            strokeColor: 'black',
            strokeWidth: 2,              
          }); 
          var pathremove = path.split(path.length - 5);
          var path2remove = path2.split(path2.length - 5);
          pathremove.remove();
          path2remove.remove();
          
          // Create a rasterized version of the path:
          var group = new Group({
            children: [path, path2, path3, path4]
          });
          var raster = group.rasterize();
          group.remove();
        } 

        
      //**********  The Straight Tool ***/
      var path;
      straight = new Tool();
      straight.onMouseDown = function(event) {
        path = new Path();
        path.strokeColor = 'black';
        path.add(event.point, event.point);
      }
      straight.onMouseDrag = function(event) {          
        path.lastSegment.point = event.point;             
      }
      straight.onMouseUp = function(event) {
        var point = path.getPointAt(path.length)
        var vector  = point.subtract(path.getPointAt(path.length-20)); 
        var arrowVector = vector.normalize(10);
        var path4 = new Path({
          segments: [point.add(arrowVector.rotate(145)), point, point.add(arrowVector.rotate(-145))],
          //fillColor: 'black',
          strokeColor: 'black',
          strokeWidth: 2,              
        });
        var pathremove = path.split(path.length - 8);
        pathremove.remove();
        var group = new Group({
          children: [path, path4]
        });
        var raster = group.rasterize();
        group.remove();  
      }          

      //**********  The Pass Tool ***/
      var path;
      pass = new Tool();
      pass.onMouseDown = function(event) {
        path = new Path();
        path.strokeColor = 'black';
        path.add(event.point, event.point);
        path.strokeWidth = 2;
        path.dashArray = [4, 4];
      }

      pass.onMouseDrag = function(event) {          
        path.lastSegment.point = event.point;             
      }
      pass.onMouseUp = function(event) {
        var point = path.getPointAt(path.length)
        var vector  = point.subtract(path.getPointAt(path.length-2)); 
        var arrowVector = vector.normalize(10);
        var path4 = new Path({
          segments: [point.add(arrowVector.rotate(145)), point, point.add(arrowVector.rotate(-145))],
          strokeColor: 'black',
          strokeWidth: 2,              
        });
        var pathremove = path.split(path.length - 8);
        pathremove.remove();
        var group = new Group({
          children: [path, path4]
        });
        var raster = group.rasterize();
          group.remove();  
        }  

      //**********  The Shoot Tool ***/
      var path;
      var path2;
      shoot = new Tool();
      shoot.onMouseDown = function(event) {
        
        path = new Path();
        path.strokeColor = 'black';
        path.strokeWidth = 6;
        path.add(event.point, event.point);
        path2 = new Path();
        path2.strokeColor = 'white';
        path2.strokeWidth = 4;
        path2.add(event.point, event.point);        
      }       

      shoot.onMouseDrag = function(event) {  
        path.lastSegment.point = event.middlePoint;            
        path2.lastSegment.point = event.middlePoint;            
      }
      shoot.onMouseUp = function(event) {
        var point = path.getPointAt(path.length)
        var vector  = point.subtract(path.getPointAt(path.length-2)); 
        var arrowVector = vector.normalize(10);
        var path4 = new Path({
          segments: [point.add(arrowVector.rotate(145)), point, point.add(arrowVector.rotate(-145))],
          strokeColor: 'black',
          strokeWidth: 2,              
        });
        var pathremove = path.split(path.length - 11);
        pathremove.remove();
        var group = new Group({
          children: [path, path2, path4]
        });
        var raster = group.rasterize();
        group.remove();  
      } 
  

      //****************The Stickhandle Tool **************/
      stickhandle = new Tool();
      stickhandle.minDistance = 15;
      stickhandle.maxDistance = 15;

      var path;
      var path2;

    stickhandle.onMouseDown = function(event){
      path2 = new Path({
        strokeColor: 'black'
      });
      path2.add(event.point);
      path = new Path({
        strokeColor: 'black'
      });
      path.add(event.point);
      //path.fullySelected = true;
      //path2.fullySelected = true;
    }

    stickhandle.onMouseDrag = function(event){
      var step = event.delta.divide(4);
      step.angle += 90;
      var top = event.lastPoint.add(step);
      var bottom = event.middlePoint.subtract(step);
      path2.add(top);
      path2.add(bottom);
      path2.smooth(300);
      path.add(event.point);
      
    } 
       
    stickhandle.onMouseUp = function(event) {
      var point = path.getPointAt(path.length)
      var vector  = point.subtract(path.getPointAt(path.length-20)); 
      var arrowVector = vector.normalize(10);
      var path4 = new Path({
        segments: [point.add(arrowVector.rotate(145)), point, point.add(arrowVector.rotate(-145))],
        strokeColor: 'black',
        strokeWidth: 2,              
      });
      var pathremove = path.split(path.length - 5);
      var path2remove = path2.split(path2.length - 17);
      pathremove.remove();
      path2remove.remove();
      var group = new Group({
        children: [path, path2, path4]
      });
      var raster = group.rasterize();
        group.remove();  
      }        
        
        
    
               
      //************ The Select Tool *********/    
      var hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 2
      };
      select_tool = new Tool();
      var segment, path;
      var movePath = false;
        
      select_tool.onMouseDown = function(event) {
        segment = path = null;
        var hitResult = project.hitTest(event.point, hitOptions);
        if (!hitResult)
          return;
        
        if (event.modifiers.shift) {
          if (hitResult.type == 'segment') {
            hitResult.segment.remove();
          };
          return;
        }
        
        if (hitResult) {
          path = hitResult.item;
          if (hitResult.type == 'segment') {
            segment = hitResult.segment;
          } else if (hitResult.type == 'stroke') {
            var location = hitResult.location;
            segment = path.insert(location.index + 1, event.point);
            path.smooth();
          }
        }
        movePath = hitResult.type == 'fill';
        if (movePath)
          project.activeLayer.addChild(hitResult.item);
      }
        
      select_tool.onMouseMove = function(event) {
        project.activeLayer.selected = false;
        if (event.item)
          event.item.selected = true;
      }
        
      select_tool.onMouseDrag = function(event) {
        if (segment) {
          segment.point = segment.point.add(event.delta);
          path.smooth();
        } else if (path) {
          path.position = path.position.add(event.delta);
        }
      }
        
      //************ The Remove Tool *********/    
      var hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 2
      };
      remove_tool = new Tool();
      var segment, path;
      var movePath = false;
        
      remove_tool.onMouseDown = function(event) {
        segment = path = null;
        var hitResult = project.hitTest(event.point, hitOptions);
        if (!hitResult)
          return;
        
        if (event.modifiers.shift) {
          if (hitResult.type == 'segment') {
            hitResult.segment.remove();
          };
          return;
        }
        
        if (hitResult) {
          path = hitResult.item;
          if (hitResult.type == 'segment') {
            segment = hitResult.segment;
          } else if (hitResult.type == 'stroke') {
            var location = hitResult.location;
          }
        }
        movePath = hitResult.type == 'fill';
        if (movePath)
          project.activeLayer.addChild(hitResult.item);
      }
        
      remove_tool.onMouseMove = function(event) {
        project.activeLayer.selected = false;
        if (event.item)
          event.item.selected = true;
      }
        
      remove_tool.onMouseUp = function(event) {
        project.activeLayer.selected = false;
        if (event.item)
          event.item.remove();
      }    
    }
    
    clear_tool = new Tool();
    clear_tool = function(event) {
      Project.clear();
    }