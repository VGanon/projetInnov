function Content (wei1, wei2, wei3, wei4, wei5) {
  // Content Weighting
  this._weight1 = wei1;
  this._weight2 = wei2;
  this._weight3 = wei3;
  this._weight4 = wei4;
  this._weight5 = wei5;

	// Getter and setter weighting 1
  getWeight1: function() {
		return this._weight1;
	};

	setWeight1: function(newWeight) {
		this._weight1 = newWeight;
	};

  // Getter and setter weighting 2
	getWeight2: function() {
		return this._weight2;
	};

	setWeight2: function(newWeight) {
		this._weight2 = newWeight;
	};
  // Getter and setter weighting 3
	getWeight3: function() {
		return this._weight3;
	};

	setWeight3: function(newWeight) {
		this._weight3 = newWeight;
	};
  // Getter and setter weighting 4
	getWeight4: function() {
		return this._weight4;
	};

	setWeight4: function(newWeight) {
		this._weight4 = newWeight;
	};
  // Getter and setter weighting 5
	getWeight5: function() {
		return this._weight5;
	};

	setWeight5: function(newWeight) {
		this._weight5 = newWeight;
	};


};
