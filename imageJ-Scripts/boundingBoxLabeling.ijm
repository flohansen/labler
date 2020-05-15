/*
* By Michael Frank 
* May 2020
*/

// Notice: Its the first version of the script, no real refactoring or improvements werde done
// -----------------------------------------------------------------------------------------------------
macro "Draw Bounding Boxes [F2]" { 
	
	// Clean previous ROIs
	roiManager("Reset");


	// Predefinitions
	// -----------------------------------------------------------------------------------------------------
	waitForUser("Draw a Rectangle(s)");

	image_name_split = split(getTitle, ".");
	image_name = image_name_split[0];
	getSelectionCoordinates(x,y);

	// Point refactoring
	// -----------------------------------------------------------------------------------------------------

	x_corners = newArray(x.length / 2);
	y_corners = newArray(x.length / 2);

	// refactore it
	counter = 0;
	for(i = 0; i < x.length; i++) {
		if(i % 2 == 0) {
			x_corners[counter] = x[i];
			y_corners[counter] = y[i];
			counter++;
		}
	}

	// Generate bounding box data
	// -----------------------------------------------------------------------------------------------------

	boundingBoxes = newArray(x.length / 4);
	for(a = 0; a < boundingBoxes.length; a++) {
		re_index = a * 2;
		boundingBoxes[a] = toString(calcBoundingBoxData(x_corners[re_index], x_corners[re_index + 1], y_corners[re_index], y_corners[re_index + 1]));
	}

	saveLabeling(boundingBoxes, image_name);
}

function saveLabeling(boundingBoxes, name) {
	path = getDirectory("image") + "labels/";
    f = File.open(path + name + ".txt"); // display file open dialog
	for (i=0; i < boundingBoxes.length; i++)
    	print(f, boundingBoxes[i]);
	waitForUser("Labeling of " + getTitle + " completed!");
}

function calcBoundingBoxData(x1, x2, y1, y2) {
	x_center = (x1 + x2) / 2;
	y_center = (y1 + y2) / 2;

	rectangle_width = absoluteValue(x2 - x1);
	rectangle_height = absoluteValue(y2 - y1);

	// normalized data
	n_x_center = x_center / getWidth;
	n_y_center = y_center / getHeight;

	waitForUser("Test: " + x_center + " / " + getWidth + " = " + n_x_center);
	waitForUser("Test: " + y_center + " / " + getHeight + " = " + n_y_center);


	n_rectangle_width = rectangle_width / getWidth;
	n_rectangle_heigth = rectangle_height / getHeight;

	return "80 " + n_x_center + " " + n_y_center + " " + n_rectangle_width + " " + n_rectangle_heigth;
}

function absoluteValue(value) {
	if(value < 0) {
		value = value * (-1);
	}
	return value;
}