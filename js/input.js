function Input() {
	var self = this;

	this.leftDown = false;
    this.rightDown = false;

    this.spaceDown = false;

    this.onKeyChange = function(e, down) {
        if(e.keyCode==65) {
            self.leftDown = down;
        }
        if(e.keyCode==68) {
            self.rightDown = down;
        }
        if(e.keyCode==32) {
            self.spaceDown = down;
        }

        if(e.keyCode==70) {
            reqFullScreen();
        }
    }

    this.handleTouchStart = function(evt) {
        reqFullScreen();
        evt.preventDefault();

        if(evt.changedTouches.length == 1) {
            self.spaceDown = true;
            var mouseX = evt.changedTouches[0].pageX;
            if(mouseX < window.innerWidth / 2) {
                self.leftDown = true;
                self.rightDown = false;
            } else {
                self.rightDown = true;
                self.leftDown = false;
            }
        }
    }

    this.handleTouchEnd = function(evt) {
        self.leftDown = false;
        self.rightDown = false;
        self.spaceDown = false;
    }

    document.addEventListener("keydown", function(e) { self.onKeyChange(e, true); });
    document.addEventListener("keyup", function(e) { self.onKeyChange(e, false  ); });
    window.addEventListener("touchstart", self.handleTouchStart, false);
    window.addEventListener("touchend", self.handleTouchEnd, false);
}