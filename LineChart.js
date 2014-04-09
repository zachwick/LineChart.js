/*
	LineChart.js
	Draw simple line chart on HTML canvas
	
	Copyright 2014 Sparisoma Viridi
	Release under the MIT license
	https://github.com/dudung/LineChart.js/blob/master/LICENSE
	
	References
		Chart.js by Nick Downie
		URL https://github.com/nnnick/Chart.js [20140409]
		
		Gnuplot
		URL http://gnuplot.sourceforge.net/ [20140409]
	
	20140409 Start the script
*/

window.lineChart = function(ctx) {
	// Initial value of font
	var fontFamily = "Times New Roman";
	var fontSize = "18px";
	var fontStyle = "Normal";
	
	// Get size of Kertas
	var width = ctx.canvas.width;
	var height = ctx.canvas.height;
	
	// Set padding for axis label and tics
	var px = 20;
	var py = 20;
	var ax = 50;
	var ay = 40;
	var ltic = 4;
	
	// Clear whole Kertas
	var clear = function() {
		ctx.clearRect(0, 0, width, height);
	}
	
	// Set font family, size, and style
	var setFontFamily = function(f) {
		fontFamily = f;
	}
	var setFontSize = function(f) {
		fontSize = f;
	}
	var setFontStyle = function(f) {
		fontStyle = f;
	}
	
	// Write at position (x, y) a text t
	var writeText = function(x, y, t) {
		ctx.font = fontStyle + " " + fontSize + " " + fontFamily;
		ctx.fillText(t, x, y);
	}
	
	// Get coordinates range
	var xmin, ymin, xmax, ymax;
	var getRange = function(data, options) {
		xmin = data[0].datax[0];
		ymin = data[0].datay[0];
		xmax = data[0].datax[0];
		ymax = data[0].datay[0];
		var Ni = data.length;
		for(var i = 0; i < Ni; i++) {
			var Nj = data[i].datax.length;
			for(var j = 0; j < Nj; j++) {
				if(xmin > data[i].datax[j]) xmin = data[i].datax[j];
				if(ymin > data[i].datay[j]) ymin = data[i].datay[j];
				if(xmax < data[i].datax[j]) xmax = data[i].datax[j];
				if(ymax < data[i].datay[j]) ymax = data[i].datay[j];
			}
		}
		if(options.xmin) xmin = options.xmin;
		if(options.ymin) ymin = options.ymin;
		if(options.xmax) xmax = options.xmax;
		if(options.ymax) ymax = options.ymax;
	}
	
	// Define transformation function
	var tx = function(x) {
		var width2 = width - 2 * px - ax;
		return (x - xmin) / (xmax - xmin) * (width2 - 0) + px + ax;
	}
	var ty = function(y) {
		var height2 = height - 2 * py - ay;
		return (y - ymin) / (ymax - ymin) * (0 - height2) + height2 + py;
	}
	
	// Plot data
	var plot = function(data) {
		var Ni = data.length;
		for(var i = 0; i < Ni; i++) {
			var Nj = data[i].datax.length;
			
			ctx.strokeStyle = data[i].lineColor;
			ctx.lineWidth = data[i].lineWidth;
			for(var j = 0; j < Nj; j++) {
				var x = tx(data[i].datax[j]);
				var y = ty(data[i].datay[j]);
				if(j == 0)
					ctx.moveTo(x, y);
				else
					ctx.lineTo(x, y);
			}
			ctx.stroke();
			
			var ps = data[i].pointSize;
			var pt = data[i].pointType;
			var plc = data[i].pointLineColor;
			var pfc = data[i].pointFillColor;
			ctx.strokeStyle = plc;
			ctx.fillStyle = pfc;
			for(var j = 0; j < Nj; j++) {
				var x = tx(data[i].datax[j]);
				var y = ty(data[i].datay[j]);
				
				switch(pt) {
					case "0":
						ctx.fillRect(x - ps/2, y - ps/2, ps, ps);
						ctx.lineWidth = "1";
						ctx.strokeRect(x - ps/2, y - ps/2, ps, ps);
					break;
					case "1":
						var R = 0.5 * ps;
						ctx.lineWidth = "1";
						ctx.beginPath();
						ctx.arc(x, y, R, 0, 2 * Math.PI, false);
						ctx.stroke();
						ctx.fill();
					break;
				}
			}
		}
	}
	
	var drawAxis = function(options) {
		ctx.lineWidth = "1";
		ctx.strokeStyle = "#000000";
		var ax1 = tx(xmin);
		var ax2 = tx(xmax);
		var ay1 = ty(ymin);
		var ay2 = ty(ymax);
		ctx.moveTo(ax1, ay1);
		ctx.lineTo(ax1, ay2);
		ctx.moveTo(ax1, ay1);
		ctx.lineTo(ax2, ay1);
		ctx.stroke();
		
		// Draw x-axis and xtics
		var xtics = options.xtics;
		var Nx = (xmax - xmin) / xtics + 1
		for(var ix = 0; ix < Nx; ix++) {
			var x = xmin + ix * xtics;
			var xx = tx(x);
			var xy = ty(ymin);
			if(xx <= ax2) {
				ctx.moveTo(xx, xy - ltic);
				ctx.lineTo(xx, xy + ltic);
			}
			ctx.stroke();
			ctx.textAlign = "center";
			writeText(xx, xy + 7 * ltic, x);
		}
		
		// Draw y axis and ytics
		var ytics = options.ytics;
		var Ny = (ymax - ymin) / ytics + 1
		for(var iy = 0; iy < Ny; iy++) {
			var xy = tx(xmin);
			var y = ymin + iy * ytics;
			var yy = ty(y);
			if(yy >= ay2) {
				ctx.moveTo(xy - ltic, yy);
				ctx.lineTo(xy + ltic, yy);
			}
			ctx.stroke();
			ctx.textAlign = "right";
			writeText(xy - 4 * ltic, yy + 1.5 * ltic, y);
		}
		
		// Draw xlabel
		var xlx = tx((xmin + xmax) / 2);
		var xly = ty(ymin);
		ctx.textAlign = "center";
		var xlabel = options.xlabel;
		setFontStyle("Italic");
		writeText(xlx, xly + 12 * ltic, xlabel);
		
		// Draw ylabel
		var ylx = tx(xmin);
		var yly = ty((ymin + ymax) / 2);
		ctx.textAlign = "right";
		var ylabel = options.ylabel;
		setFontStyle("Italic");
		writeText(ylx - 12 * ltic, yly , ylabel);
	}
	
	var linechart = this;
	
	this.line = function(data, options) {
		clear();
		getRange(data, options)
		drawAxis(options);
		plot(data);
	}
}
