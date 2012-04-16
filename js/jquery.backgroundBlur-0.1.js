(function($){

	$.fn.backgroundBlur = function (_options) {
	
		var defaults = {
			
			imagePath: null,
			imageType: 'png',
			blurRadius: 5,
			spinOptions: {
				width: 2,
				color: '#fff',
				length: 6,
				lines: 8,
				top: $(window).height() / 2,
				left: $(window).width() / 2
			}
		
		},
		options = $.extend({}, defaults, _options);
		
		var $element = $(this),
				context = $('<canvas/>', {
					id: 'canvas',
					width: '0',
					height: '0'
				}).appendTo('body').get(0).getContext('2d'),
				image = new Image();
		
		$element.spin(options.spinOptions);
		
		image.onload = function () {
				
			context.canvas.width = image.width;
			context.canvas.height = image.height;
			
			context.drawImage(image, 0, 0);
			
			stackBlurCanvasRGBA(context.canvas.id, 0, 0, context.canvas.width, context.canvas.height, options.blurRadius);
			
			var image_url = context.canvas.toDataURL('image/'+options.imageType),
					css = {
						'background': $element.css('background-color') + ' url(' + image_url + ') fixed center no-repeat',
						'-webkit-background-size': 'cover',
						'-moz-background-size': 'cover',
						'-o-background-size': 'cover',
						'-ms-background-size': 'cover',
						'background-size': 'cover'
					};
					
			return $element.spin(false).css(css);
			
			$(context.canvas).remove();
		
		};
		
		image.src = (options.imagePath) ? options.imagePath : extractUrl($element.css('background-image'));
	
	};
	
	function extractUrl (input) {
		return input.replace(/"/g,"").replace(/url\(|\)$/ig, "");
	}

})(jQuery);

// http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html
var mul_table=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];var shg_table=[9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24];function stackBlurImage(i,f,g,a){var d=document.getElementById(i);var j=d.naturalWidth;var e=d.naturalHeight;var c=document.getElementById(f);c.style.width=j+"px";c.style.height=e+"px";c.width=j;c.height=e;var b=c.getContext("2d");b.clearRect(0,0,j,e);b.drawImage(d,0,0);if(isNaN(g)||g<1){return}if(a){stackBlurCanvasRGBA(f,0,0,j,e,g)}else{stackBlurCanvasRGB(f,0,0,j,e,g)}}function stackBlurCanvasRGBA(M,G,E,a,c,Q){if(isNaN(Q)||Q<1){return}Q|=0;var j=document.getElementById(M);var aa=j.getContext("2d");var V;try{try{V=aa.getImageData(G,E,a,c)}catch(Z){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");V=aa.getImageData(G,E,a,c)}catch(Z){alert("Cannot access local image");throw new Error("unable to access local image data: "+Z);return}}}catch(Z){alert("Cannot access image");throw new Error("unable to access image data: "+Z)}var h=V.data;var O,N,X,U,s,v,n,f,g,D,T,r,F,B,b,J,P,t,q,m,u,w,z,I;var Y=Q+Q+1;var K=a<<2;var o=a-1;var S=c-1;var l=Q+1;var R=l*(l+1)/2;var H=new BlurStack();var C=H;for(X=1;X<Y;X++){C=C.next=new BlurStack();if(X==l){var k=C}}C.next=H;var W=null;var L=null;n=v=0;var A=mul_table[Q];var d=shg_table[Q];for(N=0;N<c;N++){J=P=t=q=f=g=D=T=0;r=l*(m=h[v]);F=l*(u=h[v+1]);B=l*(w=h[v+2]);b=l*(z=h[v+3]);f+=R*m;g+=R*u;D+=R*w;T+=R*z;C=H;for(X=0;X<l;X++){C.r=m;C.g=u;C.b=w;C.a=z;C=C.next}for(X=1;X<l;X++){U=v+((o<X?o:X)<<2);f+=(C.r=(m=h[U]))*(I=l-X);g+=(C.g=(u=h[U+1]))*I;D+=(C.b=(w=h[U+2]))*I;T+=(C.a=(z=h[U+3]))*I;J+=m;P+=u;t+=w;q+=z;C=C.next}W=H;L=k;for(O=0;O<a;O++){h[v+3]=z=(T*A)>>d;if(z!=0){z=255/z;h[v]=((f*A)>>d)*z;h[v+1]=((g*A)>>d)*z;h[v+2]=((D*A)>>d)*z}else{h[v]=h[v+1]=h[v+2]=0}f-=r;g-=F;D-=B;T-=b;r-=W.r;F-=W.g;B-=W.b;b-=W.a;U=(n+((U=O+Q+1)<o?U:o))<<2;J+=(W.r=h[U]);P+=(W.g=h[U+1]);t+=(W.b=h[U+2]);q+=(W.a=h[U+3]);f+=J;g+=P;D+=t;T+=q;W=W.next;r+=(m=L.r);F+=(u=L.g);B+=(w=L.b);b+=(z=L.a);J-=m;P-=u;t-=w;q-=z;L=L.next;v+=4}n+=a}for(O=0;O<a;O++){P=t=q=J=g=D=T=f=0;v=O<<2;r=l*(m=h[v]);F=l*(u=h[v+1]);B=l*(w=h[v+2]);b=l*(z=h[v+3]);f+=R*m;g+=R*u;D+=R*w;T+=R*z;C=H;for(X=0;X<l;X++){C.r=m;C.g=u;C.b=w;C.a=z;C=C.next}s=a;for(X=1;X<=Q;X++){v=(s+O)<<2;f+=(C.r=(m=h[v]))*(I=l-X);g+=(C.g=(u=h[v+1]))*I;D+=(C.b=(w=h[v+2]))*I;T+=(C.a=(z=h[v+3]))*I;J+=m;P+=u;t+=w;q+=z;C=C.next;if(X<S){s+=a}}v=O;W=H;L=k;for(N=0;N<c;N++){U=v<<2;h[U+3]=z=(T*A)>>d;if(z>0){z=255/z;h[U]=((f*A)>>d)*z;h[U+1]=((g*A)>>d)*z;h[U+2]=((D*A)>>d)*z}else{h[U]=h[U+1]=h[U+2]=0}f-=r;g-=F;D-=B;T-=b;r-=W.r;F-=W.g;B-=W.b;b-=W.a;U=(O+(((U=N+l)<S?U:S)*a))<<2;f+=(J+=(W.r=h[U]));g+=(P+=(W.g=h[U+1]));D+=(t+=(W.b=h[U+2]));T+=(q+=(W.a=h[U+3]));W=W.next;r+=(m=L.r);F+=(u=L.g);B+=(w=L.b);b+=(z=L.a);J-=m;P-=u;t-=w;q-=z;L=L.next;v+=a}}aa.putImageData(V,G,E)}function stackBlurCanvasRGB(J,D,B,a,b,N){if(isNaN(N)||N<1){return}N|=0;var h=document.getElementById(J);var W=h.getContext("2d");var R;try{try{R=W.getImageData(D,B,a,b)}catch(V){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");R=W.getImageData(D,B,a,b)}catch(V){alert("Cannot access local image");throw new Error("unable to access local image data: "+V);return}}}catch(V){alert("Cannot access image");throw new Error("unable to access image data: "+V)}var g=R.data;var L,K,T,Q,q,t,m,d,f,A,n,C,w,G,M,r,l,s,u,F;var U=N+N+1;var H=a<<2;var o=a-1;var P=b-1;var k=N+1;var O=k*(k+1)/2;var E=new BlurStack();var z=E;for(T=1;T<U;T++){z=z.next=new BlurStack();if(T==k){var j=z}}z.next=E;var S=null;var I=null;m=t=0;var v=mul_table[N];var c=shg_table[N];for(K=0;K<b;K++){G=M=r=d=f=A=0;n=k*(l=g[t]);C=k*(s=g[t+1]);w=k*(u=g[t+2]);d+=O*l;f+=O*s;A+=O*u;z=E;for(T=0;T<k;T++){z.r=l;z.g=s;z.b=u;z=z.next}for(T=1;T<k;T++){Q=t+((o<T?o:T)<<2);d+=(z.r=(l=g[Q]))*(F=k-T);f+=(z.g=(s=g[Q+1]))*F;A+=(z.b=(u=g[Q+2]))*F;G+=l;M+=s;r+=u;z=z.next}S=E;I=j;for(L=0;L<a;L++){g[t]=(d*v)>>c;g[t+1]=(f*v)>>c;g[t+2]=(A*v)>>c;d-=n;f-=C;A-=w;n-=S.r;C-=S.g;w-=S.b;Q=(m+((Q=L+N+1)<o?Q:o))<<2;G+=(S.r=g[Q]);M+=(S.g=g[Q+1]);r+=(S.b=g[Q+2]);d+=G;f+=M;A+=r;S=S.next;n+=(l=I.r);C+=(s=I.g);w+=(u=I.b);G-=l;M-=s;r-=u;I=I.next;t+=4}m+=a}for(L=0;L<a;L++){M=r=G=f=A=d=0;t=L<<2;n=k*(l=g[t]);C=k*(s=g[t+1]);w=k*(u=g[t+2]);d+=O*l;f+=O*s;A+=O*u;z=E;for(T=0;T<k;T++){z.r=l;z.g=s;z.b=u;z=z.next}q=a;for(T=1;T<=N;T++){t=(q+L)<<2;d+=(z.r=(l=g[t]))*(F=k-T);f+=(z.g=(s=g[t+1]))*F;A+=(z.b=(u=g[t+2]))*F;G+=l;M+=s;r+=u;z=z.next;if(T<P){q+=a}}t=L;S=E;I=j;for(K=0;K<b;K++){Q=t<<2;g[Q]=(d*v)>>c;g[Q+1]=(f*v)>>c;g[Q+2]=(A*v)>>c;d-=n;f-=C;A-=w;n-=S.r;C-=S.g;w-=S.b;Q=(L+(((Q=K+k)<P?Q:P)*a))<<2;d+=(G+=(S.r=g[Q]));f+=(M+=(S.g=g[Q+1]));A+=(r+=(S.b=g[Q+2]));S=S.next;n+=(l=I.r);C+=(s=I.g);w+=(u=I.b);G-=l;M-=s;r-=u;I=I.next;t+=a}}W.putImageData(R,D,B)}function BlurStack(){this.r=0;this.g=0;this.b=0;this.a=0;this.next=null};