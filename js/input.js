function Input() {
	var self = this;

	this.leftDown = false;
    this.rightDown = false;

    this.onKeyChange = function(e, down) {
        if(e.keyCode==65) {
            self.leftDown = down;
        }
        if(e.keyCode==68) {
            self.rightDown = down;
        }
    }

    document.addEventListener("keydown", function(e) { self.onKeyChange(e, true); });
    document.addEventListener("keyup", function(e) { self.onKeyChange(e, false  ); });
}