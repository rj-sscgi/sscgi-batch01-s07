// The size of the game container (32x32)
const size = 32;
const game_board = [];
let ghost_positions = [];

// Pacman Initial Position
let pacman_position = {
	x: 0,
	y: 0,
};

let health = 15; // Starting health
const health_display = document.getElementById("health_display"); // Assuming there's an element to display health

// Table Setup
for (let rw = 0; rw < size + 1; rw++) {
	let row = [];

	for (let col = 0; col < size; col++) {
		row.push(" ");
	}

	game_board.push(row);
}

function generate_ghost_positions() {
	ghost_positions = []; // Clear previous ghost positions
	for (let index = 0; index < 8; index++) {
		let ghost_position = {
			ghost_x: Math.floor(Math.random() * size - 1), // random x
			ghost_y: Math.floor(Math.random() * size - 1), // random y
		};

		// Ensure Ghost Position != Pacman Position and no duplicate ghost positions
		while (
			(ghost_position.ghost_x === pacman_position.x &&
				ghost_position.ghost_y === pacman_position.y) ||
			ghost_positions.some(
				(ghost) =>
					ghost.ghost_x === ghost_position.ghost_x &&
					ghost.ghost_y === ghost_position.ghost_y
			)
		) {
			ghost_position = {
				ghost_x: Math.floor(Math.random() * size),
				ghost_y: Math.floor(Math.random() * size),
			};
		}
		ghost_positions.push(ghost_position);
	}
}

// Generate ghost positions once on page load
generate_ghost_positions();

// Table Creation
const game_board_element = document.getElementById("game_container");

// Create table and Pacman placement
function create_board() {
	game_board_element.innerHTML = ""; // Clear the table before redrawing
	for (let i = 0; i < game_board.length; i++) {
		let row = document.createElement("tr");

		for (let j = 0; j < game_board[i].length; j++) {
			let cell = document.createElement("td");
			cell.textContent = game_board[i][j];

			// Name of the class (each cell)
			cell.classList.add("box_cell_" + (i + 1) + "_" + (j + 1));

			// Place the ghosts based on their stored positions
			ghost_positions.forEach((ghost_position, index) => {
				if (i === ghost_position.ghost_x && j === ghost_position.ghost_y) {
					let ghost = document.createElement("div");
					ghost.classList.add("enemy_ghost" + (index + 1));
					cell.appendChild(ghost);
				}
			});

			// Place Pacman at the current position
			if (i === pacman_position.x && j === pacman_position.y) {
				let pacman = document.createElement("div");
				pacman.classList.add("pac_man");
				cell.appendChild(pacman);
			}
			row.appendChild(cell);
		}

		game_board_element.appendChild(row);
	}
}

// Function to check for collision with ghosts
function check_collision() {
	const ghost_health = {
		1: 300,
		2: 200,
		3: 100,
		4: 80,
		5: 50,
		6: 30,
		7: 20,
		8: 10,
	};

	for (let index = 0; index < ghost_positions.length; index++) {
		if (
			pacman_position.x === ghost_positions[index].ghost_x &&
			pacman_position.y === ghost_positions[index].ghost_y
		) {
			// Get the ghost element by its class name
			const ghostClassName = "enemy_ghost" + (index + 1);
			const ghostElement = document.querySelector("." + ghostClassName);

			if (ghostElement) {
				const ghostHealth = ghost_health[index + 1]; // Fetch health for this ghost

				// Adjust Pac-Man's health based on collision
				if (health >= ghostHealth) {
					health += ghostHealth; // Add ghost health to Pac-Man
				} else {
					health -= ghostHealth; // Subtract ghost health from Pac-Man
				}

				// Update health display
				update_health_display();

				// Remove the ghost position from the array
				ghost_positions.splice(index, 1);

				return true; // Collision detected
			}
		}
	}
	return false; // No collision
}

// Function to update health display
function update_health_display() {
	health_display.textContent = "Health: " + health;
	if (health <= 0) {
		alert("Game Over! You ran out of health.");
		reset_game();
	}
}

// Handle Arrow Key Movement
document.addEventListener("keydown", function (event) {
	let moved = false;
	switch (event.key) {
		// MOVE UP
		case "ArrowUp":
			if (pacman_position.x > 0) {
				pacman_position.x--;
				moved = true;
			}
			break;

		// MOVE DOWN
		case "ArrowDown":
			if (pacman_position.x < size - 2) {
				pacman_position.x++;
				moved = true;
			}
			break;

		// MOVE LEFT
		case "ArrowLeft":
			if (pacman_position.y > 0) {
				pacman_position.y--;
				moved = true;
			}
			break;

		// MOVE RIGHT
		case "ArrowRight":
			if (pacman_position.y < size - 1) {
				pacman_position.y++;
				moved = true;
			}
			break;
	}

	// If Pac-Man moved, check for collision and redraw the board
	if (moved) {
		if (check_collision()) {
			// Handle collision (health is reduced already inside check_collision)
		}
		// Redraw the board after PacMan moves
		create_board();
	}
});

// Reset Game Function
function reset_game() {
	health = 15; // Reset health
	pacman_position = { x: 0, y: 0 }; // Reset PacMan position
	generate_ghost_positions();
	create_board();
	update_health_display();
}

// Initial GameBoard Rendering
create_board();
update_health_display();
