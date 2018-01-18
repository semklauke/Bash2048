//INFO:
//cord-object = {x: a, y: b}
//a, b (int) sind die die x/y Koordinaten

// Konstruktor für das Piece-Objekt
//-- arguments -- 
// v (int) => Wert des Pieces
// m (bool) => wurde im letzten Zug gemerged
//-- return --
// piece-object (obj)
function newPiece(v, m) {
	return {
		value: parseInt(v), //Zahl auf dem Piece
		merged: !!m, //true: wurde im letzten Zug aus 2 kleineren erstellt // false: nicht
		old: null //für groups Heuristik benutzt
	};
}

// Gibt alle Rechtungen als Vektoren zurück
//-- return --
// Array with cord-objects (array)
function getDirections() {
	return [
		{ x: 0, y: 1 }, // up
		{ x: 1, y: 0 }, // right
		{ x: 0, y: -1 }, // down
		{ x: -1, y: 0 } // left 
	];
}

// Errechnet Level (siehe Documenatation) des Pieces
//-- arguments --
// piece (piece-object) => 
//-- return --
// Level des Pieces (int)
function getPieceLvl(piece) {
	return Math.log(parseInt(piece.value)) / Math.log(2);
}


// Konstruktor der Klasse Board. Diese repräsentiert das Spielbrett und verwaltet die Pieces auf dem Brett
//-- arguments -- 
// index (bool) (can be undefinded) => soll das Brett indexiert werden ? 
//-- return --
// board-object (obj)
function Board(index) {
	this.pieces = []; //Grundgerüst des Spielbertts. Enthält allte Pieces
	if (index == undefined || index == true)
		// Gerüst mit NULL Werten befüllen
		for (var x=0; x<4; x++) {
			this.pieces[x] = [];
			for (var y=0; y<4; y++)
				this.pieces[x][y] = null;
		}
	
	// Entscheidet ob am nächsten Zug der Spieler spielt, oder der Computer (-> neues Piece auf's Spielbrett)
	// false: nächster Zug Spieler // true: nächster Zug Computer
	this.playerMoved = false; //Spieler beginnt
}

// Gibt das Level des pieces an der Koordiante zurück
//-- arguments --
// cords (cords-object) => 
//-- return --
// lvl (int) => wenn cords auf Spielbrett und ein Piece vorhanden ist
// 0 (int) => ansonsten
Board.prototype.getLvl = function(cords) {
	if (this.onBoard(cords)) {
		var p = this.getPiece(cords);
		if (p != null && p != undefined)
			return getPieceLvl(p);
	}
	return 0;
};

// fügt ein Piece auf dem Spielbrett ein
//-- arguments --
// cord (cord-object) => Koordinaten wo das Piece einefügt wird
// piece (piece-object) => Piece welches eingefügt wird  
Board.prototype.addPiece = function (cord, piece) {
	this.pieces[cord.x][cord.y] = piece;
};

// Löscht ein Piece auf dem Spielbrett
//-- arguments --
// cord (cord-object)
//-- return --
Board.prototype.removePiece = function (cord) {
	this.pieces[cord.x][cord.y] = null;
};


// Prüft ob die Koordniaten auf dem Spielbrett liegen
//-- arguments -- 
// cord (cord-object) => zu prüfenden Koordinaten
//-- return --
// true (bool) => Koordinaten sind zulässig
// fasle (bool) => Koordinaten sind unzulässig
Board.prototype.onBoard = function (cord) {
	if (cord.x < 0 || cord.x > 3)
		return false;
	if (cord.y < 0 || cord.y > 3)
		return false;
	return true;
};

//Gibt Piece auf dem Spielbrett zurück
//-- arguments --
// cord (cord-object) => Koordinaten, von denen das Piece zurückgegeben werden soll
//-- return --
// piece-obejct (obj) => wenn Kooridinaten zulassig und Feld nicht leer
// null => wenn Feld leer oder Kooridnaten unzulässig
Board.prototype.getPiece = function(cord) {
	if (this.onBoard(cord))
		return this.pieces[cord.x][cord.y];
	else 
		return null;
};

// Prüft ob bei einer Koordinaten auf dem Spielbertt eine Piece vorhanden ist
//-- arguments --
// cord (cord-object) => zu prüfenden Koordinaten
//-- return --
// true (bool) => Das Feld ist frei
// false (bool) => auf dem Feld ist ein Piece
Board.prototype.freePiece = function(cord) {
	if (this.getPiece(cord) == null)
		return true;
	else return false;
};

// Verschiebt ein Piece auf dem Spiebrett auf eine neue Position
//-- arguments --
// oCord (cord-object) => Alte Position des Pieces
// nCord (cord-object) => Neue Position des Pieces
Board.prototype.updatePosistion = function(oCord, nCord) {
	var np = this.getPiece(oCord);
	np.old = { x: oCord.x, y: oCord.y };
	this.addPiece(nCord, np);
	this.removePiece(oCord);
};

// Kopiert die gesamte Board Klasse
// Wird gebraucht um das Baord in der AI weiter spielen zu können, ohen das aktuelle Board zu beienfluss (Also die Variabvlenen dieses Boardes im Speicher)
//-- return --
// Board Klasse (obj) => Kopie dieser Klasse, nur neue Speicherstelle
Board.prototype.copy = function() {
	var newBoard = new Board(false);
	for (var x=0; x<4; x++) {
		newBoard.pieces[x] = this.pieces[x].slice();
	}
	return newBoard;
};

// Löscht aus allen Pieces die Information, ob sie im letzten zum gemerged wurden
Board.prototype.clearMerge = function() {
	for (var x=0; x<4; x++)
		for (var y=0; y<4; y++)
			if (this.pieces[x][y] != null)
				this.pieces[x][y].merged = false;
};

// Gibt alle Freien Felder auf dem Spielrett zurück
//-- return --
// array with cords-obejcts (array) => alle Koordianten die Frei sind
Board.prototype.freePieces = function() {
	var ps = [];
	for (var x=0; x<4; x++) 
		for (var y=0; y<4; y++) 
			if (this.getPiece({ x: x, y: y }) == null)
				ps.push({ x: x, y: y });
	return ps;
};


// Führt einen Spielzug aus. Bewegt allso alle Pieces in die Richtung, in die der Spielzug ausgeführt wurde
// Dabei werdne auch Pieces gemerged
// Es gibt die Option eine Fuktion für das GUI mitzübergeben
//-- arguments --
// x (int) => bewegung in X-Richtung (0/1/-1)
// y (int) => bewegung in Y-Richtung (0/1/-1)
// uiMove (function) => uiMove(oldCord, newCord, merged)
//   oldCord (cord-object) => alte position des Pieces
//   newCord (cord-obejct) => neue position des Pieces
//   merged (bool) => ist die neue position gemerged ?
//-- return --
// true (bool) => Spielrichtugn gültig und Spielzug wurde ausgeführt
// false (bool) => Spielzug ist unszulässig
Board.prototype.moveBoard = function(x, y, uiMove) { 	
	//up:     0  /  1
	//down:   0  / -1
	//left:   -1 /  0
	//right:  1  /  0
	this.clearMerge();
	var moved = false;

	if (this.playerMoved == true)
		return moved;

	var pathX = x != 1 ? [0, 1, 2, 3] : [3, 2, 1, 0];
	var pathY = y != 1 ? [0, 1, 2, 3] : [3, 2, 1, 0];

	xloop:
	for (var xM=0; xM<4; xM++) {
		yloop:
		for (var yM=0; yM<4; yM++) {

			var cords = { x: pathX[xM], y: pathY[yM] };
			var oldPos = { x: pathX[xM], y: pathY[yM] };

			var piece = this.getPiece(cords);

			if (piece == null)
				continue yloop;

			var newPos;

			posloop:
			while (true) {
				cords.x += x;
				cords.y += y;

				if (!this.onBoard(cords)) {
					newPos = { 
						pos: { x: cords.x - x, y: cords.y - y },
						next: null 
					};
					break posloop;
				}
				
				if (!this.freePiece(cords)) {
					newPos = { 
						pos: { x: cords.x - x, y: cords.y - y },
						next: this.getPiece(cords),
						nextPos: cords 
					};
					break posloop;
				}
			}

			if (newPos.next != null && !newPos.next.merged && newPos.next.value == piece.value) {
				this.addPiece(newPos.nextPos, newPiece(piece.value * 2, true));
				this.removePiece(oldPos);
				moved = true;
				if (uiMove !== undefined) 
					uiMove(oldPos, newPos.nextPos, true);
			} else if (oldPos.x != newPos.pos.x || oldPos.y != newPos.pos.y) {
				this.updatePosistion(oldPos, newPos.pos);
				moved = true;
				if (uiMove !== undefined)
					uiMove(oldPos, newPos.pos, false);
			}
		}
	}
	this.playerMoved = true;
	//console.log(_board.pieces);
	return moved;

};

// Füt eine zufällges Piece (2/4) na eine Zufa4llige fereie Kooridnate auf dem Spiebrett
//-- return --
// obj:
//   pos (cord-object) => Koordinaten des Hinugefügten Pieces
//   value (int) => Wert des Hinugefügten Pieces 
Board.prototype.addRandomPiece = function() {
	var p = newPiece(Math.random() < 0.9 ? 2 : 4); // 90% 2er, 10% 4er

	var free = [];
	for (var x=0; x<4; x++)
		for (var y=0; y<4; y++)
			if (this.pieces[x][y] == null)
				free.push({ x: x, y: y});

	if (free.length == 0)
		return null;
	var cords = free[Math.round(Math.random() * (free.length-1))];
	this.addPiece(cords, p);
	return { pos: cords, value: p.value };
};
