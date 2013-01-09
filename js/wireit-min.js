if(typeof ie9!="undefined")YAHOO.env.ua.ie=0;var WireIt={defaultWireClass:"WireIt.BezierWire",wireClassFromXtype:function(A){return this.classFromXtype(A,this.defaultWireClass)},defaultTerminalClass:"WireIt.Terminal",terminalClassFromXtype:function(A){return this.classFromXtype(A,this.defaultTerminalClass)},defaultContainerClass:"WireIt.Container",containerClassFromXtype:function(A){return this.classFromXtype(A,this.defaultContainerClass)},classFromXtype:function(E,C){var D=(E||C).split(".");var A=window;for(var B=0;B<D.length;B++){A=A[D[B]]}if(!YAHOO.lang.isFunction(A)){throw new Error("WireIt unable to find klass from xtype: '"+E+"'")}return A},getIntStyle:function(B,A){var C=YAHOO.util.Dom.getStyle(B,A);return parseInt(C.substr(0,C.length-2),10)},sn:function(D,C,A){if(!D){return }var B;if(C){for(B in C){if(C.hasOwnProperty(B)){var E=C[B];if(typeof (E)=="function"){continue}if(B=="className"){B="class";D.className=E}if(E!==D.getAttribute(B)){if(E===false){D.removeAttribute(B)}else{D.setAttribute(B,E)}}}}}if(A){for(B in A){if(A.hasOwnProperty(B)){if(typeof (A[B])=="function"){continue}if(D.style[B]!=A[B]){D.style[B]=A[B]}}}}},cn:function(A,C,B,E){var D=document.createElement(A);this.sn(D,C,B);if(E){D.innerHTML=E}return D},indexOf:YAHOO.lang.isFunction(Array.prototype.indexOf)?function(B,A){return A.indexOf(B)}:function(C,A){for(var B=0;B<A.length;B++){if(A[B]==C){return B}}return -1},compact:YAHOO.lang.isFunction(Array.prototype.compact)?function(A){return A.compact()}:function(A){var C=[];for(var B=0;B<A.length;B++){if(A[B]){C.push(A[B])}}return C}};WireIt.util={};(function(){var A=YAHOO.util.Event,B=YAHOO.env.ua;WireIt.CanvasElement=function(C){this.element=document.createElement("canvas");C.appendChild(this.element);if(typeof (G_vmlCanvasManager)!="undefined"){this.element=G_vmlCanvasManager.initElement(this.element)}};WireIt.CanvasElement.prototype={getContext:function(C){return this.element.getContext(C||"2d")},destroy:function(){var C=this.element;if(YAHOO.util.Dom.inDocument(C)){C.parentNode.removeChild(C)}A.purgeElement(C,true)},SetCanvasRegion:B.ie?function(G,F,E,C){var D=this.element;WireIt.sn(D,null,{left:G+"px",top:F+"px",width:E+"px",height:C+"px"});D.getContext("2d").clearRect(0,0,E,C);this.element=D}:((B.webkit||B.opera)?function(F,J,C,K){var D=this.element;var H=WireIt.cn("canvas",{className:D.className||D.getAttribute("class"),width:C,height:K},{left:F+"px",top:J+"px"});var I=A.getListeners(D);for(var E in I){if(I.hasOwnProperty(E)){var G=I[E];A.addListener(H,G.type,G.fn,G.obj,G.adjust)}}A.purgeElement(D);D.parentNode.replaceChild(H,D);this.element=H}:function(F,E,D,C){WireIt.sn(this.element,{width:D,height:C},{left:F+"px",top:E+"px"})})}})();WireIt.Wire=function(D,C,B,A){this.parentEl=B;this.terminal1=D;this.terminal2=C;this.eventMouseClick=new YAHOO.util.CustomEvent("eventMouseClick");this.eventMouseIn=new YAHOO.util.CustomEvent("eventMouseIn");this.eventMouseOut=new YAHOO.util.CustomEvent("eventMouseOut");this.eventMouseMove=new YAHOO.util.CustomEvent("eventMouseMove");this.setOptions(A||{});WireIt.Wire.superclass.constructor.call(this,this.parentEl);YAHOO.util.Dom.addClass(this.element,this.className);if(this.label){this.renderLabel()}this.terminal1.addWire(this);this.terminal2.addWire(this)};YAHOO.lang.extend(WireIt.Wire,WireIt.CanvasElement,{xtype:"WireIt.Wire",className:"WireIt-Wire",cap:"round",bordercap:"round",width:3,borderwidth:1,color:"rgb(173, 216, 230)",bordercolor:"#0000ff",label:null,labelStyle:null,labelEditor:null,setOptions:function(B){for(var A in B){if(B.hasOwnProperty(A)){this[A]=B[A]}}},remove:function(){this.parentEl.removeChild(this.element);if(this.terminal1&&this.terminal1.removeWire){this.terminal1.removeWire(this)}if(this.terminal2&&this.terminal2.removeWire){this.terminal2.removeWire(this)}this.terminal1=null;this.terminal2=null;if(this.labelEl){if(this.labelField){this.labelField.destroy()}this.labelEl.innerHTML=""}},getOtherTerminal:function(A){return(A==this.terminal1)?this.terminal2:this.terminal1},draw:function(){var E=[4,4];var H=this.terminal1.getXY();var G=this.terminal2.getXY();var D=[Math.min(H[0],G[0])-E[0],Math.min(H[1],G[1])-E[1]];var B=[Math.max(H[0],G[0])+E[0],Math.max(H[1],G[1])+E[1]];this.min=D;this.max=B;var F=Math.abs(B[0]-D[0]);var C=Math.abs(B[1]-D[1]);H[0]=H[0]-D[0];H[1]=H[1]-D[1];G[0]=G[0]-D[0];G[1]=G[1]-D[1];this.SetCanvasRegion(D[0],D[1],F,C);var A=this.getContext();A.lineCap=this.bordercap;A.strokeStyle=this.bordercolor;A.lineWidth=this.width+this.borderwidth*2;A.beginPath();A.moveTo(H[0],H[1]);A.lineTo(G[0],G[1]);A.stroke();A.lineCap=this.cap;A.strokeStyle=this.color;A.lineWidth=this.width;A.beginPath();A.moveTo(H[0],H[1]);A.lineTo(G[0],G[1]);A.stroke()},redraw:function(){this.draw();if(this.label){this.positionLabel()}},renderLabel:function(){this.labelEl=WireIt.cn("div",{className:"WireIt-Wire-Label"},this.labelStyle);if(this.labelEditor){this.labelField=new inputEx.InPlaceEdit({parentEl:this.labelEl,editorField:this.labelEditor,animColors:{from:"#FFFF99",to:"#DDDDFF"}});this.labelField.setValue(this.label)}else{this.labelEl.innerHTML=this.label}this.element.parentNode.appendChild(this.labelEl)},setLabel:function(A){if(this.labelEditor){this.labelField.setValue(A)}else{this.labelEl.innerHTML=A}},positionLabel:function(){YAHOO.util.Dom.setStyle(this.labelEl,"left",(this.min[0]+this.max[0]-this.labelEl.clientWidth)/2);YAHOO.util.Dom.setStyle(this.labelEl,"top",(this.min[1]+this.max[1]-this.labelEl.clientHeight)/2)},wireDrawnAt:function(B,E){var A=this.getContext();var D=A.getImageData(B,E,1,1);var C=D.data;return !(C[0]===0&&C[1]===0&&C[2]===0&&C[3]===0)},onMouseMove:function(A,B){if(typeof this.mouseInState===undefined){this.mouseInState=false}if(this.wireDrawnAt(A,B)){if(!this.mouseInState){this.mouseInState=true;this.onWireIn(A,B)}this.onWireMove(A,B)}else{if(this.mouseInState){this.mouseInState=false;this.onWireOut(A,B)}}},onWireMove:function(A,B){this.eventMouseMove.fire(this,[A,B])},onWireIn:function(A,B){this.eventMouseIn.fire(this,[A,B])},onWireOut:function(A,B){this.eventMouseOut.fire(this,[A,B])},onClick:function(A,B){if(this.wireDrawnAt(A,B)){this.onWireClick(A,B)}},onWireClick:function(A,B){this.eventMouseClick.fire(this,[A,B])},getConfig:function(){var A={xtype:this.xtype};if(this.labelEditor){A.label=this.labelField.getValue()}return A}});WireIt.StepWire=function(D,C,B,A){WireIt.StepWire.superclass.constructor.call(this,D,C,B,A)};YAHOO.lang.extend(WireIt.StepWire,WireIt.Wire,{xtype:"WireIt.StepWire",draw:function(){var B=[4,4];var H=this.terminal1.getXY();var G=this.terminal2.getXY();var C=[Math.min(H[0],G[0])-B[0],Math.min(H[1],G[1])-B[1]];var E=[Math.max(H[0],G[0])+B[0],Math.max(H[1],G[1])+B[1]];var A=Math.abs(E[0]-C[0]);var I=Math.abs(E[1]-C[1]);H[0]=H[0]-C[0];H[1]=H[1]-C[1];G[0]=G[0]-C[0];G[1]=G[1]-C[1];var F=[G[0],G[1]];G[1]=H[1];this.SetCanvasRegion(C[0],C[1],A,I);var D=this.getContext();D.lineCap=this.bordercap;D.strokeStyle=this.bordercolor;D.lineWidth=this.width+this.borderwidth*2;D.beginPath();D.moveTo(H[0],H[1]);D.lineTo(G[0],G[1]);D.lineTo(F[0],F[1]);D.stroke();D.lineCap=this.cap;D.strokeStyle=this.color;D.lineWidth=this.width;D.beginPath();D.moveTo(H[0],H[1]);D.lineTo(G[0],G[1]);D.lineTo(F[0],F[1]);D.stroke()}});WireIt.ArrowWire=function(D,C,B,A){WireIt.ArrowWire.superclass.constructor.call(this,D,C,B,A)};YAHOO.lang.extend(WireIt.ArrowWire,WireIt.Wire,{xtype:"WireIt.ArrowWire",draw:function(){var j=7;var G=j+3;var Y=[4+G,4+G];var E=this.terminal1.getXY();var D=this.terminal2.getXY();var J=Math.sqrt(Math.pow(E[0]-D[0],2)+Math.pow(E[1]-D[1],2));var f=[Math.min(E[0],D[0])-Y[0],Math.min(E[1],D[1])-Y[1]];var g=[Math.max(E[0],D[0])+Y[0],Math.max(E[1],D[1])+Y[1]];this.min=f;this.max=g;var K=Math.abs(g[0]-f[0])+G;var V=Math.abs(g[1]-f[1])+G;E[0]=E[0]-f[0];E[1]=E[1]-f[1];D[0]=D[0]-f[0];D[1]=D[1]-f[1];this.SetCanvasRegion(f[0],f[1],K,V);var N=this.getContext();N.lineCap=this.bordercap;N.strokeStyle=this.bordercolor;N.lineWidth=this.width+this.borderwidth*2;N.beginPath();N.moveTo(E[0],E[1]);N.lineTo(D[0],D[1]);N.stroke();N.lineCap=this.cap;N.strokeStyle=this.color;N.lineWidth=this.width;N.beginPath();N.moveTo(E[0],E[1]);N.lineTo(D[0],D[1]);N.stroke();var R=E;var Q=D;var P=[0,0];var M=20;var T=(J===0)?0:1-(M/J);P[0]=Math.abs(R[0]+T*(Q[0]-R[0]));P[1]=Math.abs(R[1]+T*(Q[1]-R[1]));var m,l;var I=R[0]-Q[0];var U=R[1]-Q[1];var S=R[0]*Q[1]-R[1]*Q[0];if(I!==0){m=U/I;l=S/I}else{m=0}var L,O;if(m===0){L=0}else{L=-1/m}O=P[1]-L*P[0];var c=1+Math.pow(L,2);var Z=2*L*O-2*P[0]-2*P[1]*L;var X=-2*P[1]*O+Math.pow(P[0],2)+Math.pow(P[1],2)-Math.pow(j,2)+Math.pow(O,2);var k=Math.pow(Z,2)-4*c*X;if(k<0){return }var i=(-Z+Math.sqrt(k))/(2*c);var h=(-Z-Math.sqrt(k))/(2*c);var H=L*i+O;var F=L*h+O;if(R[1]==Q[1]){var e=(R[0]>Q[0])?1:-1;i=Q[0]+e*M;h=i;H-=j;F+=j}N.fillStyle=this.color;N.beginPath();N.moveTo(Q[0],Q[1]);N.lineTo(i,H);N.lineTo(h,F);N.fill();N.strokeStyle=this.bordercolor;N.lineWidth=this.borderwidth;N.beginPath();N.moveTo(Q[0],Q[1]);N.lineTo(i,H);N.lineTo(h,F);N.lineTo(Q[0],Q[1]);N.stroke()}});WireIt.BezierWire=function(D,C,B,A){WireIt.BezierWire.superclass.constructor.call(this,D,C,B,A)};YAHOO.lang.extend(WireIt.BezierWire,WireIt.Wire,{xtype:"WireIt.BezierWire",coeffMulDirection:100,draw:function(){var O=this.terminal1.getXY();var M=this.terminal2.getXY();var F=this.coeffMulDirection;var B=Math.sqrt(Math.pow(O[0]-M[0],2)+Math.pow(O[1]-M[1],2));if(B<F){F=B/2}var C=[this.terminal1.direction[0]*F,this.terminal1.direction[1]*F];var A=[this.terminal2.direction[0]*F,this.terminal2.direction[1]*F];var L=[];L[0]=O;L[1]=[O[0]+C[0],O[1]+C[1]];L[2]=[M[0]+A[0],M[1]+A[1]];L[3]=M;var H=[O[0],O[1]];var K=[O[0],O[1]];for(var I=1;I<L.length;I++){var D=L[I];if(D[0]<H[0]){H[0]=D[0]}if(D[1]<H[1]){H[1]=D[1]}if(D[0]>K[0]){K[0]=D[0]}if(D[1]>K[1]){K[1]=D[1]}}var G=[4,4];H[0]=H[0]-G[0];H[1]=H[1]-G[1];K[0]=K[0]+G[0];K[1]=K[1]+G[1];var E=Math.abs(K[0]-H[0]);var N=Math.abs(K[1]-H[1]);this.min=H;this.max=K;this.SetCanvasRegion(H[0],H[1],E,N);var J=this.getContext();for(I=0;I<L.length;I++){L[I][0]=L[I][0]-H[0];L[I][1]=L[I][1]-H[1]}J.lineCap=this.bordercap;J.strokeStyle=this.bordercolor;J.lineWidth=this.width+this.borderwidth*2;J.beginPath();J.moveTo(L[0][0],L[0][1]);J.bezierCurveTo(L[1][0],L[1][1],L[2][0],L[2][1],L[3][0],L[3][1]);J.stroke();J.lineCap=this.cap;J.strokeStyle=this.color;J.lineWidth=this.width;J.beginPath();J.moveTo(L[0][0],L[0][1]);J.bezierCurveTo(L[1][0],L[1][1],L[2][0],L[2][1],L[3][0],L[3][1]);J.stroke()}});WireIt.BezierArrowWire=function(D,C,B,A){WireIt.BezierArrowWire.superclass.constructor.call(this,D,C,B,A)};YAHOO.lang.extend(WireIt.BezierArrowWire,WireIt.BezierWire,{xtype:"WireIt.BezierArrowWire",draw:function(){var E=Math.round(this.width*1.5+20);var Q=Math.round(this.width*1.2+20);var r=E/2;var G=r+3;var F=[4+G,4+G];var q=this.terminal1.getXY();var n=this.terminal2.getXY();var w=this.coeffMulDirection;var P=Math.sqrt(Math.pow(q[0]-n[0],2)+Math.pow(q[1]-n[1],2));if(P<w){w=P/2}var k=[this.terminal1.direction[0]*w,this.terminal1.direction[1]*w];var j=[this.terminal2.direction[0]*w,this.terminal2.direction[1]*w];var O=[];O[0]=q;O[1]=[q[0]+k[0],q[1]+k[1]];O[2]=[n[0]+j[0],n[1]+j[1]];O[3]=n;var s=[q[0],q[1]];var R=[q[0],q[1]];for(var m=1;m<O.length;m++){var f=O[m];if(f[0]<s[0]){s[0]=f[0]}if(f[1]<s[1]){s[1]=f[1]}if(f[0]>R[0]){R[0]=f[0]}if(f[1]>R[1]){R[1]=f[1]}}s[0]=s[0]-F[0];s[1]=s[1]-F[1];R[0]=R[0]+F[0];R[1]=R[1]+F[1];var S=Math.abs(R[0]-s[0]);var Y=Math.abs(R[1]-s[1]);this.min=s;this.max=R;this.SetCanvasRegion(s[0],s[1],S,Y);var h=this.getContext();for(m=0;m<O.length;m++){O[m][0]=O[m][0]-s[0];O[m][1]=O[m][1]-s[1]}h.lineCap=this.bordercap;h.strokeStyle=this.bordercolor;h.lineWidth=this.width+this.borderwidth*2;h.beginPath();h.moveTo(O[0][0],O[0][1]);h.bezierCurveTo(O[1][0],O[1][1],O[2][0],O[2][1],O[3][0],O[3][1]+Q/2*this.terminal2.direction[1]);h.stroke();h.lineCap=this.cap;h.strokeStyle=this.color;h.lineWidth=this.width;h.beginPath();h.moveTo(O[0][0],O[0][1]);h.bezierCurveTo(O[1][0],O[1][1],O[2][0],O[2][1],O[3][0],O[3][1]+Q/2*this.terminal2.direction[1]);h.stroke();var X=O[2],V=n;var c=[0,0];var H=Q;var e=1-(H/P);c[0]=Math.abs(X[0]+e*(V[0]-X[0]));c[1]=Math.abs(X[1]+e*(V[1]-X[1]));var v,u;var D=X[0]-V[0];var U=X[1]-V[1];var T=X[0]*V[1]-X[1]*V[0];if(D!==0){v=U/D;u=T/D}else{v=0}var N,l;if(v===0){N=0}else{N=-1/v}l=c[1]-N*c[0];var L=1+Math.pow(N,2),J=2*N*l-2*c[0]-2*c[1]*N,I=-2*c[1]*l+Math.pow(c[0],2)+Math.pow(c[1],2)-Math.pow(r,2)+Math.pow(l,2),Z=Math.pow(J,2)-4*L*I;if(Z<0){return false}var M=(-J+Math.sqrt(Z))/(2*L),K=(-J-Math.sqrt(Z))/(2*L),y=N*M+l,x=N*K+l;if(X[1]==V[1]){var g=(X[0]>V[0])?1:-1;M=V[0]+g*H;K=M;y-=r;x+=r}h.fillStyle=this.color;h.beginPath();h.moveTo(V[0],V[1]);h.lineTo(M,y);h.lineTo(K,x);h.fill();h.strokeStyle=this.bordercolor;h.lineWidth=this.borderwidth;h.beginPath();h.moveTo(V[0],V[1]);h.lineTo(M,y);h.lineTo(K,x);h.lineTo(V[0],V[1]);h.stroke();return[q,n,X,V]}});(function(){var A=YAHOO.util;var C=YAHOO.lang,B="WireIt-";WireIt.TerminalProxy=function(E,D){this.terminal=E;this.termConfig=D||{};this.terminalProxySize=D.terminalProxySize||10;this.fakeTerminal=null;WireIt.TerminalProxy.superclass.constructor.call(this,this.terminal.el,undefined,{dragElId:"WireIt-TerminalProxy",resizeFrame:false,centerFrame:true})};A.DDM.mode=A.DDM.INTERSECT;C.extend(WireIt.TerminalProxy,YAHOO.util.DDProxy,{createFrame:function(){var E=this,D=document.body;if(!D||!D.firstChild){window.setTimeout(function(){E.createFrame()},50);return }var J=this.getDragEl(),I=YAHOO.util.Dom;if(!J){J=document.createElement("div");J.id=this.dragElId;var H=J.style;H.position="absolute";H.visibility="hidden";H.cursor="move";H.border="2px solid #aaa";H.zIndex=999;var F=this.terminalProxySize+"px";H.height=F;H.width=F;var G=document.createElement("div");I.setStyle(G,"height","100%");I.setStyle(G,"width","100%");I.setStyle(G,"background-color","#ccc");I.setStyle(G,"opacity","0");J.appendChild(G);D.insertBefore(J,D.firstChild)}},startDrag:function(){if(this.terminal.nMaxWires==1&&this.terminal.wires.length==1){this.terminal.wires[0].remove()}else{if(this.terminal.wires.length>=this.terminal.nMaxWires){return }}var E=this.terminalProxySize/2;this.fakeTerminal={direction:this.terminal.fakeDirection,pos:[200,200],addWire:function(){},removeWire:function(){},getXY:function(){var G=YAHOO.util.Dom.getElementsByClassName("WireIt-Layer");if(G.length>0){var H=YAHOO.util.Dom.getXY(G[0]);return[this.pos[0]-H[0]+E,this.pos[1]-H[1]+E]}return this.pos}};var F=this.terminal.parentEl.parentNode;if(this.terminal.container){F=this.terminal.container.layer.el}var D=WireIt.wireClassFromXtype(this.terminal.editingWireConfig.xtype);this.editingWire=new D(this.terminal,this.fakeTerminal,F,this.terminal.editingWireConfig);YAHOO.util.Dom.addClass(this.editingWire.element,B+"Wire-editing")},onDrag:function(F){if(!this.editingWire){return }if(this.terminal.container){var E=this.terminal.container.layer.el;var G=0;var D=0;if(E.offsetParent){do{G+=E.scrollLeft;D+=E.scrollTop;E=E.offsetParent}while(E)}this.fakeTerminal.pos=[F.clientX+G,F.clientY+D]}else{this.fakeTerminal.pos=(YAHOO.env.ua.ie)?[F.clientX,F.clientY]:[F.clientX+window.pageXOffset,F.clientY+window.pageYOffset]}this.editingWire.redraw()},endDrag:function(D){if(this.editingWire){this.editingWire.remove();this.editingWire=null}},onDragEnter:function(F,D){if(!this.editingWire){return }for(var E=0;E<D.length;E++){if(this.isValidWireTerminal(D[E])){D[E].terminal.setDropInvitation(true)}}},onDragOut:function(F,D){if(!this.editingWire){return }for(var E=0;E<D.length;E++){if(this.isValidWireTerminal(D[E])){D[E].terminal.setDropInvitation(false)}}},onDragDrop:function(L,J){var H;if(!this.editingWire){return }this.onDragOut(L,J);var N=null;for(H=0;H<J.length;H++){if(this.isValidWireTerminal(J[H])){N=J[H];break}}if(!N){return }this.editingWire.remove();this.editingWire=null;var G=false;for(H=0;H<this.terminal.wires.length;H++){if(this.terminal.wires[H].terminal1==this.terminal){if(this.terminal.wires[H].terminal2==N.terminal){G=true;break}}else{if(this.terminal.wires[H].terminal2==this.terminal){if(this.terminal.wires[H].terminal1==N.terminal){G=true;break}}}}if(G){return }var I=this.terminal.parentEl.parentNode;if(this.terminal.container){I=this.terminal.container.layer.el}var F=this.terminal;var E=N.terminal;if(E.alwaysSrc){F=N.terminal;E=this.terminal}var K=WireIt.wireClassFromXtype(F.wireConfig.xtype);var D=N.terminal,M;if(D.nMaxWires==1){if(D.wires.length>0){D.wires[0].remove()}M=new K(F,E,I,F.wireConfig);M.redraw()}else{if(D.wires.length<D.nMaxWires){M=new K(F,E,I,F.wireConfig);M.redraw()}}},isWireItTerminal:true,isValidWireTerminal:function(D){if(!D.isWireItTerminal){return false}if(this.termConfig.type){if(this.termConfig.allowedTypes){if(WireIt.indexOf(D.termConfig.type,this.termConfig.allowedTypes)==-1){return false}}else{if(this.termConfig.type!=D.termConfig.type){return false}}}else{if(D.termConfig.type){if(D.termConfig.allowedTypes){if(WireIt.indexOf(this.termConfig.type,D.termConfig.allowedTypes)==-1){return false}}else{if(this.termConfig.type!=D.termConfig.type){return false}}}}if(this.terminal.container){if(this.terminal.container.preventSelfWiring){if(D.terminal.container==this.terminal.container){return false}}}return true}})})();(function(){var B=YAHOO.util;var A=B.Event,D=YAHOO.lang,C="WireIt-";WireIt.Scissors=function(E,F){WireIt.Scissors.superclass.constructor.call(this,document.createElement("div"),F);this._terminal=E;this.initScissors()};WireIt.Scissors.visibleInstance=null;D.extend(WireIt.Scissors,YAHOO.util.Element,{initScissors:function(){this.hideNow();this.addClass(C+"Wire-scissors");this.appendTo(this._terminal.container?this._terminal.container.layer.el:this._terminal.el.parentNode.parentNode);this.on("mouseover",this.show,this,true);this.on("mouseout",this.hide,this,true);this.on("click",this.scissorClick,this,true);A.addListener(this._terminal.el,"mouseover",this.mouseOver,this,true);A.addListener(this._terminal.el,"mouseout",this.hide,this,true)},setPosition:function(){var E=this._terminal.getXY();this.setStyle("left",(E[0]+this._terminal.direction[0]*30-8)+"px");this.setStyle("top",(E[1]+this._terminal.direction[1]*30-8)+"px")},mouseOver:function(){if(this._terminal.wires.length>0){this.show()}},scissorClick:function(){this._terminal.removeAllWires();if(this.terminalTimeout){this.terminalTimeout.cancel()}this.hideNow()},show:function(){this.setPosition();this.setStyle("display","");if(WireIt.Scissors.visibleInstance&&WireIt.Scissors.visibleInstance!=this){if(WireIt.Scissors.visibleInstance.terminalTimeout){WireIt.Scissors.visibleInstance.terminalTimeout.cancel()}WireIt.Scissors.visibleInstance.hideNow()}WireIt.Scissors.visibleInstance=this;if(this.terminalTimeout){this.terminalTimeout.cancel()}},hide:function(){this.terminalTimeout=YAHOO.lang.later(700,this,this.hideNow)},hideNow:function(){WireIt.Scissors.visibleInstance=null;this.setStyle("display","none")}})})();(function(){var B=YAHOO.util;var A=B.Event,E=YAHOO.lang,C=B.Dom,D="WireIt-";WireIt.Terminal=function(H,G,F){this.name=null;this.parentEl=H;this.container=F;this.wires=[];this.setOptions(G);this.eventAddWire=new B.CustomEvent("eventAddWire");this.eventRemoveWire=new B.CustomEvent("eventRemoveWire");this.el=null;this.render();if(this.editable){this.dd=new WireIt.TerminalProxy(this,this.ddConfig);this.scissors=new WireIt.Scissors(this)}};WireIt.Terminal.prototype={xtype:"WireIt.Terminal",direction:[0,1],fakeDirection:[0,-1],editable:true,nMaxWires:Infinity,wireConfig:{},editingWireConfig:{},className:"WireIt-Terminal",connectedClassName:"WireIt-Terminal-connected",dropinviteClassName:"WireIt-Terminal-dropinvite",offsetPosition:null,alwaysSrc:false,ddConfig:false,setOptions:function(G){for(var F in G){if(G.hasOwnProperty(F)){this[F]=G[F]}}if(G.direction&&!G.fakeDirection){this.fakeDirection=[-G.direction[0],-G.direction[1]]}if(G.wireConfig&&!G.editingWireConfig){this.editingWireConfig=this.wireConfig}},setDropInvitation:function(F){if(F){C.addClass(this.el,this.dropinviteClassName)}else{C.removeClass(this.el,this.dropinviteClassName)}},render:function(){this.el=WireIt.cn("div",{className:this.className});if(this.name){this.el.title=this.name}this.setPosition(this.offsetPosition);this.parentEl.appendChild(this.el)},setPosition:function(G){if(G){this.el.style.left="";this.el.style.top="";this.el.style.right="";this.el.style.bottom="";if(E.isArray(G)){this.el.style.left=G[0]+"px";this.el.style.top=G[1]+"px"}else{if(E.isObject(G)){for(var F in G){if(G.hasOwnProperty(F)&&G[F]!==""){this.el.style[F]=G[F]+"px"}}}}}},addWire:function(F){this.wires.push(F);C.addClass(this.el,this.connectedClassName);this.eventAddWire.fire(F)},removeWire:function(G){var F=WireIt.indexOf(G,this.wires);if(F!=-1){this.wires[F].destroy();this.wires[F]=null;this.wires=WireIt.compact(this.wires);if(this.wires.length===0){C.removeClass(this.el,this.connectedClassName)}this.eventRemoveWire.fire(G)}},getXY:function(){var G=this.container&&this.container.layer?this.container.layer.el:document.body;var H=this.el;var I=0,F=0;if(H.offsetParent){do{I+=H.offsetLeft;F+=H.offsetTop;H=H.offsetParent}while(!!H&&H!=G)}return[I+15,F+15]},remove:function(){while(this.wires.length>0){this.wires[0].remove()}this.parentEl.removeChild(this.el);A.purgeElement(this.el);if(this.scissors){A.purgeElement(this.scissors.get("element"))}},getConnectedTerminals:function(){var F=[];if(this.wires){for(var G=0;G<this.wires.length;G++){F.push(this.wires[G].getOtherTerminal(this))}}return F},redrawAllWires:function(){if(this.wires){for(var F=0;F<this.wires.length;F++){this.wires[F].redraw()}}},removeAllWires:function(){while(this.wires.length>0){this.wires[0].remove()}}}})();WireIt.util.TerminalInput=function(C,B,A){WireIt.util.TerminalInput.superclass.constructor.call(this,C,B,A)};YAHOO.lang.extend(WireIt.util.TerminalInput,WireIt.Terminal,{xtype:"WireIt.TerminalInput",direction:[0,-1],fakeDirection:[0,1],nMaxWires:1,ddConfig:{type:"input",allowedTypes:["output"]}});WireIt.util.TerminalOutput=function(C,B,A){WireIt.util.TerminalOutput.superclass.constructor.call(this,C,B,A)};YAHOO.lang.extend(WireIt.util.TerminalOutput,WireIt.Terminal,{xtype:"WireIt.TerminalOutput",direction:[0,1],fakeDirection:[0,-1],ddConfig:{type:"output",allowedTypes:["input"]},alwaysSrc:true});WireIt.util.DD=function(D,C,A,B){if(!D){throw new Error("WireIt.util.DD needs at least terminals and id")}this._WireItTerminals=D;WireIt.util.DD.superclass.constructor.call(this,C,A,B)};YAHOO.extend(WireIt.util.DD,YAHOO.util.DD,{onDrag:function(C){var A=YAHOO.lang.isArray(this._WireItTerminals)?this._WireItTerminals:(this._WireItTerminals.isWireItTerminal?[this._WireItTerminals]:[]);for(var B=0;B<A.length;B++){A[B].redrawAllWires()}},setTerminals:function(A){this._WireItTerminals=A}});WireIt.util.DDResize=function(A,B){this.myConf=B||{};this.myConf.container=A;this.myConf.minWidth=this.myConf.minWidth||50;this.myConf.minHeight=this.myConf.minHeight||50;WireIt.util.DDResize.superclass.constructor.apply(this,[A.el,A.ddResizeHandle]);this.setHandleElId(A.ddResizeHandle);this.eventResize=new YAHOO.util.CustomEvent("eventResize")};YAHOO.extend(WireIt.util.DDResize,YAHOO.util.DragDrop,{onMouseDown:function(B){var A=this.getEl();this.startWidth=A.offsetWidth;this.startHeight=A.offsetHeight;this.startPos=[YAHOO.util.Event.getPageX(B),YAHOO.util.Event.getPageY(B)]},onDrag:function(F){var D=[YAHOO.util.Event.getPageX(F),YAHOO.util.Event.getPageY(F)];var A=D[0]-this.startPos[0];var G=D[1]-this.startPos[1];var E=Math.max(this.startWidth+A,this.myConf.minWidth);var C=Math.max(this.startHeight+G,this.myConf.minHeight);var B=this.getEl();B.style.width=E+"px";B.style.height=C+"px";this.myConf.container.redrawAllWires();this.eventResize.fire([E,C])}});(function(){var B=YAHOO.util;var C=B.Dom,A=B.Event,D="WireIt-";WireIt.Container=function(E,F){this.setOptions(E);this.layer=F;this.terminals=[];this.wires=[];this.el=null;this.bodyEl=null;this.eventAddWire=new B.CustomEvent("eventAddWire");this.eventRemoveWire=new B.CustomEvent("eventRemoveWire");this.eventFocus=new B.CustomEvent("eventFocus");this.eventBlur=new B.CustomEvent("eventBlur");this.render();if(E.terminals){this.initTerminals(E.terminals)}if(this.resizable){this.makeResizable()}if(this.draggable){this.makeDraggable()}};WireIt.Container.prototype={xtype:"WireIt.Container",draggable:true,position:[100,100],className:D+"Container",ddHandle:true,ddHandleClassName:D+"Container-ddhandle",resizable:true,resizeHandleClassName:D+"Container-resizehandle",close:true,closeButtonClassName:D+"Container-closebutton",groupable:true,preventSelfWiring:true,title:null,icon:null,width:null,height:null,setOptions:function(F){for(var E in F){if(F.hasOwnProperty(E)){this[E]=F[E]}}},makeResizable:function(){this.ddResize=new WireIt.util.DDResize(this);this.ddResize.eventResize.subscribe(this.onResize,this,true)},makeDraggable:function(){this.dd=new WireIt.util.DD(this.terminals,this.el);this.dd.setXConstraint(this.position[0]);this.dd.setYConstraint(this.position[1]);if(this.ddHandle){this.dd.setHandleElId(this.ddHandle)}if(this.resizable){this.dd.addInvalidHandleId(this.ddResizeHandle);this.ddResize.addInvalidHandleId(this.ddHandle)}},onResize:function(G,E){var F=E[0];WireIt.sn(this.bodyEl,null,{width:(F[0]-14)+"px",height:(F[1]-(this.ddHandle?44:14))+"px"})},render:function(){this.el=WireIt.cn("div",{className:this.className});if(this.width){this.el.style.width=this.width+"px"}if(this.height){this.el.style.height=this.height+"px"}A.addListener(this.el,"mousedown",this.onMouseDown,this,true);if(this.ddHandle){this.ddHandle=WireIt.cn("div",{className:this.ddHandleClassName});this.el.appendChild(this.ddHandle);if(this.icon){var E=WireIt.cn("img",{src:this.icon,className:"WireIt-Container-icon"});this.ddHandle.appendChild(E)}if(this.title){this.ddHandle.appendChild(WireIt.cn("span",{className:"floatleft"},null,this.title))}}this.bodyEl=WireIt.cn("div",{className:"body"});this.el.appendChild(this.bodyEl);if(this.resizable){this.ddResizeHandle=WireIt.cn("div",{className:this.resizeHandleClassName});this.el.appendChild(this.ddResizeHandle)}if(this.close){this.closeButton=WireIt.cn("div",{className:this.closeButtonClassName});if(this.ddHandle){this.ddHandle.appendChild(this.closeButton)}else{this.el.appendChild(this.closeButton)}A.addListener(this.closeButton,"click",this.onCloseButton,this,true)}if(this.groupable&&this.ddHandle){this.groupButton=WireIt.cn("div",{className:"WireIt-Container-groupbutton"});this.ddHandle.appendChild(this.groupButton);A.addListener(this.groupButton,"click",this.onGroupButton,this,true)}this.layer.el.appendChild(this.el);this.el.style.left=this.position[0]+"px";this.el.style.top=this.position[1]+"px"},setBody:function(E){if(typeof E=="string"){this.bodyEl.innerHTML=E}else{this.bodyEl.innerHTML="";this.bodyEl.appendChild(E)}},onMouseDown:function(E){if(this.layer){if(this.layer.focusedContainer&&this.layer.focusedContainer!=this){this.layer.focusedContainer.removeFocus()}this.setFocus();this.layer.focusedContainer=this}},setFocus:function(){C.addClass(this.el,D+"Container-focused");this.eventFocus.fire(this)},removeFocus:function(){C.removeClass(this.el,D+"Container-focused");this.eventBlur.fire(this)},onCloseButton:function(F,E){A.stopEvent(F);this.layer.removeContainer(this)},highlight:function(){this.el.style.border="2px solid blue"},dehighlight:function(){this.el.style.border=""},superHighlight:function(){this.el.style.border="4px outset blue"},remove:function(){this.removeAllTerminals();this.layer.el.removeChild(this.el);A.purgeElement(this.el)},initTerminals:function(F){for(var E=0;E<F.length;E++){this.addTerminal(F[E])}},addTerminal:function(G){var E=WireIt.terminalClassFromXtype(G.xtype);var F=new E(this.el,G,this);this.terminals.push(F);F.eventAddWire.subscribe(this.onAddWire,this,true);F.eventRemoveWire.subscribe(this.onRemoveWire,this,true);return F},onAddWire:function(F,E){var G=E[0];if(WireIt.indexOf(G,this.wires)==-1){this.wires.push(G);this.eventAddWire.fire(G)}},onRemoveWire:function(G,F){var H=F[0];var E=WireIt.indexOf(H,this.wires);if(E!=-1){this.eventRemoveWire.fire(H);this.wires[E]=null}this.wires=WireIt.compact(this.wires)},removeAllTerminals:function(){for(var E=0;E<this.terminals.length;E++){this.terminals[E].remove()}this.terminals=[]},redrawAllWires:function(){for(var E=0;E<this.terminals.length;E++){this.terminals[E].redrawAllWires()}},getXY:function(){var F=C.getXY(this.el);if(this.layer){var E=C.getXY(this.layer.el);F[0]-=E[0];F[1]-=E[1];F[0]+=this.layer.el.scrollLeft;F[1]+=this.layer.el.scrollTop}return F},getConfig:function(){return{position:this.getXY(),xtype:this.xtype}},getValue:function(){return{}},setValue:function(E){},getTerminal:function(E){var G;for(var F=0;F<this.terminals.length;F++){G=this.terminals[F];if(G.name==E){return G}}return null}}})();WireIt.Layer=function(B){this.setOptions(B);this.containers=[];this.wires=[];this.groups=[];this.el=null;this.eventChanged=new YAHOO.util.CustomEvent("eventChanged");this.eventAddWire=new YAHOO.util.CustomEvent("eventAddWire");this.eventRemoveWire=new YAHOO.util.CustomEvent("eventRemoveWire");this.eventAddContainer=new YAHOO.util.CustomEvent("eventAddContainer");this.eventRemoveContainer=new YAHOO.util.CustomEvent("eventRemoveContainer");this.eventContainerDragged=new YAHOO.util.CustomEvent("eventContainerDragged");this.eventContainerResized=new YAHOO.util.CustomEvent("eventContainerResized");this.render();if(B.containers){this.initContainers(B.containers)}if(B.wires){this.initWires(B.wires)}if(this.layerMap){this.layermap=new WireIt.LayerMap(this,this.layerMapOptions)}if(WireIt.Grouper){this.grouper=new WireIt.Grouper(this,this.grouper.baseConfigFunction);var C=this.grouper.rubberband;this.el.onmousedown=function(D){return C.layerMouseDown.call(C,D)};var A=this.grouper;this.el.addEventListener("mouseup",function(D){C.finish();A.rubberbandSelect.call(A)},false)}};WireIt.Layer.prototype={className:"WireIt-Layer",parentEl:null,layerMap:false,layerMapOptions:null,enableMouseEvents:true,grouper:null,setOptions:function(B){for(var A in B){if(B.hasOwnProperty(A)){this[A]=B[A]}}if(!this.parentEl){this.parentEl=document.body}},render:function(){this.el=WireIt.cn("div",{className:this.className});this.parentEl.appendChild(this.el)},initContainers:function(B){for(var A=0;A<B.length;A++){this.addContainer(B[A])}},initWires:function(B){for(var A=0;A<B.length;A++){this.addWire(B[A])}},setSuperHighlighted:function(B){this.unsetSuperHighlighted();for(var A in B){if(B.hasOwnProperty(A)){B[A].superHighlight()}}this.superHighlighted=B},unsetSuperHighlighted:function(){if(YAHOO.lang.isValue(this.superHighlighted)){for(var A in this.superHighlighted){if(this.superHighlighted.hasOwnProperty(A)){this.superHighlighted[A].highlight()}}}this.superHighlighted=null},addWire:function(B){var A=WireIt.wireClassFromXtype(B.xtype);var E=B.src;var G=B.tgt;var F=this.containers[E.moduleId].getTerminal(E.terminal);var D=this.containers[G.moduleId].getTerminal(G.terminal);var C=new A(F,D,this.el,B);C.redraw();return C},addContainer:function(C){var A=WireIt.containerClassFromXtype(C.xtype);var B=new A(C,this);return this.addContainerDirect(B)},addContainerDirect:function(A){this.containers.push(A);A.eventAddWire.subscribe(this.onAddWire,this,true);A.eventRemoveWire.subscribe(this.onRemoveWire,this,true);if(A.ddResize){A.ddResize.on("endDragEvent",function(){this.eventContainerResized.fire(A);this.eventChanged.fire(this)},this,true)}if(A.dd){A.dd.on("endDragEvent",function(){this.eventContainerDragged.fire(A);this.eventChanged.fire(this)},this,true)}this.eventAddContainer.fire(A);this.eventChanged.fire(this);return A},removeContainer:function(A){var B=WireIt.indexOf(A,this.containers);if(B!=-1){A.remove();this.containers[B]=null;this.containers=WireIt.compact(this.containers);this.eventRemoveContainer.fire(A);this.eventChanged.fire(this)}},removeGroup:function(F,C){var A=this.groups.indexOf(F),B;if(A!=-1){this.groups.splice(A,1)}if(C){if(YAHOO.lang.isValue(F.groupContainer)){this.removeContainer(F.groupContainer)}else{for(B in F.containers){if(F.containers.hasOwnProperty(B)){var E=F.containers[B].container;this.removeContainer(E)}}for(B in F.groups){if(F.containers.hasOwnProperty(B)){var D=F.groups[B].group;this.removeGroup(D)}}}}},onAddWire:function(B,A){var C=A[0];if(WireIt.indexOf(C,this.wires)==-1){this.wires.push(C);if(this.enableMouseEvents){YAHOO.util.Event.addListener(C.element,"mousemove",this.onWireMouseMove,this,true);YAHOO.util.Event.addListener(C.element,"click",this.onWireClick,this,true)}this.eventAddWire.fire(C);this.eventChanged.fire(this)}},onRemoveWire:function(C,B){var D=B[0];var A=WireIt.indexOf(D,this.wires);if(A!=-1){this.wires[A]=null;this.wires=WireIt.compact(this.wires);this.eventRemoveWire.fire(D);this.eventChanged.fire(this)}},clear:function(){while(this.containers.length>0){this.removeContainer(this.containers[0])}},removeAllContainers:function(){this.clear()},getWiring:function(){var B;var C={containers:[],wires:[]};for(B=0;B<this.containers.length;B++){C.containers.push(this.containers[B].getConfig())}for(B=0;B<this.wires.length;B++){var D=this.wires[B];var A=D.getConfig();A.src={moduleId:WireIt.indexOf(D.terminal1.container,this.containers),terminal:D.terminal1.name};A.tgt={moduleId:WireIt.indexOf(D.terminal2.container,this.containers),terminal:D.terminal2.name};C.wires.push(A)}return C},setWiring:function(B){this.clear();var A;if(YAHOO.lang.isArray(B.containers)){for(A=0;A<B.containers.length;A++){this.addContainer(B.containers[A])}}if(YAHOO.lang.isArray(B.wires)){for(A=0;A<B.wires.length;A++){this.addWire(B.wires[A])}}},_getMouseEvtPos:function(B){var C=YAHOO.util.Event.getTarget(B);var A=[C.offsetLeft,C.offsetTop];return[A[0]+B.layerX,A[1]+B.layerY]},onWireClick:function(J){var D=this._getMouseEvtPos(J);var H=D[0],F=D[1],G=this.wires.length,K;for(var I=0;I<G;I++){K=this.wires[I];var E=K.element.offsetLeft,C=K.element.offsetTop;if(H>=E&&H<E+K.element.width&&F>=C&&F<C+K.element.height){var B=H-E,A=F-C;K.onClick(B,A)}}},onWireMouseMove:function(J){var D=this._getMouseEvtPos(J);var H=D[0],F=D[1],G=this.wires.length,K;for(var I=0;I<G;I++){K=this.wires[I];var E=K.element.offsetLeft,C=K.element.offsetTop;if(H>=E&&H<E+K.element.width&&F>=C&&F<C+K.element.height){var B=H-E,A=F-C;K.onMouseMove(B,A)}}}};(function(){var B=YAHOO.util.Dom,A=YAHOO.util.Event;WireIt.LayerMap=function(D,C){this.layer=D;this.setOptions(C);if(typeof C.parentEl=="string"){this.parentEl=YAHOO.util.Dom.get(C.parentEl)}else{if(this.layer&&!this.parentEl){this.parentEl=this.layer.el}}WireIt.LayerMap.superclass.constructor.call(this,this.parentEl);this.element.className=this.className;this.initEvents();this.draw()};YAHOO.lang.extend(WireIt.LayerMap,WireIt.CanvasElement,{className:"WireIt-LayerMap",style:"rgba(0, 0, 200, 0.5)",parentEl:null,lineWidth:2,setOptions:function(D){for(var C in D){if(D.hasOwnProperty(C)){this[C]=D[C]}}},initEvents:function(){var C=this.layer;A.addListener(this.element,"mousedown",this.onMouseDown,this,true);A.addListener(this.element,"mouseup",this.onMouseUp,this,true);A.addListener(this.element,"mousemove",this.onMouseMove,this,true);A.addListener(this.element,"mouseout",this.onMouseUp,this,true);C.eventAddWire.subscribe(this.draw,this,true);C.eventRemoveWire.subscribe(this.draw,this,true);C.eventAddContainer.subscribe(this.draw,this,true);C.eventRemoveContainer.subscribe(this.draw,this,true);C.eventContainerDragged.subscribe(this.draw,this,true);C.eventContainerResized.subscribe(this.draw,this,true);A.addListener(this.layer.el,"scroll",this.onLayerScroll,this,true)},onMouseMove:function(D,C){A.stopEvent(D);if(this.isMouseDown){this.scrollLayer(D.clientX,D.clientY)}},onMouseUp:function(D,C){A.stopEvent(D);this.isMouseDown=false},onMouseDown:function(D,C){A.stopEvent(D);this.scrollLayer(D.clientX,D.clientY);this.isMouseDown=true},scrollLayer:function(E,D){var P=B.getXY(this.element);var R=[E-P[0],D-P[1]];var H=B.getRegion(this.element);var G=H.right-H.left-4;var K=H.bottom-H.top-4;var F=this.layer.el.scrollWidth;var N=this.layer.el.scrollHeight;var I=Math.floor(100*G/F)/100;var O=Math.floor(100*K/N)/100;var C=[R[0]/I,R[1]/O];var Q=B.getRegion(this.layer.el);var M=Q.right-Q.left;var J=Q.bottom-Q.top;var L=[Math.max(Math.floor(C[0]-M/2),0),Math.max(Math.floor(C[1]-J/2),0)];if(L[0]+M>F){L[0]=F-M}if(L[1]+J>N){L[1]=N-J}this.layer.el.scrollLeft=L[0];this.layer.el.scrollTop=L[1]},onLayerScroll:function(){if(this.scrollTimer){window.clearTimeout(this.scrollTimer)}var C=this;this.scrollTimer=window.setTimeout(function(){C.draw()},50)},draw:function(){var N=this.getContext();var E=B.getRegion(this.element);var D=E.right-E.left-4;var J=E.bottom-E.top-4;N.clearRect(0,0,D,J);var C=this.layer.el.scrollWidth;var L=this.layer.el.scrollHeight;var F=Math.floor(100*D/C)/100;var M=Math.floor(100*J/L)/100;var O=B.getRegion(this.layer.el);var K=O.right-O.left;var I=O.bottom-O.top;var H=this.layer.el.scrollLeft;var G=this.layer.el.scrollTop;N.strokeStyle="rgb(200, 50, 50)";N.lineWidth=1;N.strokeRect(H*F,G*M,K*F,I*M);N.fillStyle=this.style;N.strokeStyle=this.style;N.lineWidth=this.lineWidth;this.drawContainers(N,F,M);this.drawWires(N,F,M)},drawContainers:function(C,I,F){var H=this.layer.containers;var J=H.length,E,D=WireIt.getIntStyle,G;for(E=0;E<J;E++){G=H[E].el;C.fillRect(D(G,"left")*I,D(G,"top")*F,D(G,"width")*I,D(G,"height")*F)}},drawWires:function(G,D,F){var K=this.layer.wires;var C=K.length,E,I;for(E=0;E<C;E++){I=K[E];var J=I.terminal1.getXY(),H=I.terminal2.getXY();G.beginPath();G.moveTo(J[0]*D,J[1]*F);G.lineTo(H[0]*D,H[1]*F);G.closePath();G.stroke()}}})})();WireIt.ImageContainer=function(A,B){WireIt.ImageContainer.superclass.constructor.call(this,A,B)};YAHOO.lang.extend(WireIt.ImageContainer,WireIt.Container,{xtype:"WireIt.ImageContainer",resizable:false,ddHandle:false,className:"WireIt-Container WireIt-ImageContainer",image:null,render:function(){WireIt.ImageContainer.superclass.render.call(this);YAHOO.util.Dom.setStyle(this.bodyEl,"background-image","url("+this.image+")")}});WireIt.InOutContainer=function(A,B){WireIt.InOutContainer.superclass.constructor.call(this,A,B)};YAHOO.lang.extend(WireIt.InOutContainer,WireIt.Container,{xtype:"WireIt.InOutContainer",resizable:false,className:"WireIt-Container WireIt-InOutContainer",inputs:[],outputs:[],render:function(){WireIt.InOutContainer.superclass.render.call(this);for(var C=0;C<this.inputs.length;C++){var B=this.inputs[C];this.terminals.push({name:B,direction:[-1,0],offsetPosition:{left:-14,top:3+30*(C+1)},ddConfig:{type:"input",allowedTypes:["output"]}});this.bodyEl.appendChild(WireIt.cn("div",null,{lineHeight:"30px"},B))}for(C=0;C<this.outputs.length;C++){var A=this.outputs[C];this.terminals.push({name:A,direction:[1,0],offsetPosition:{right:-14,top:3+30*(C+1+this.inputs.length)},ddConfig:{type:"output",allowedTypes:["input"]},alwaysSrc:true});this.bodyEl.appendChild(WireIt.cn("div",null,{lineHeight:"30px",textAlign:"right"},A))}}});