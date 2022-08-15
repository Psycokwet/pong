const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;



function draw(area, ctx, game) {
    // Draw field
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, area.width, area.height);

    // Draw middle line
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(area.width / 2, 0);
    ctx.lineTo(area.width / 2, area.height);
    ctx.stroke();

    // Draw players
    ctx.fillStyle = 'white';
    ctx.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    ctx.fillRect(area.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
    ctx.fill();
}

function animate(game) {
    game.ball.x += game.ball.speed.x * game.ball.acc_coef;
    game.ball.y += game.ball.speed.y * game.ball.acc_coef;
    if (game.ball.y < 0) {
        game.ball.speed.y = -1 * game.ball.speed.y;
        game.ball.y += game.ball.speed.y * game.ball.acc_coef;
    } else if (game.ball.y > game.canvas.height) {
        game.ball.speed.y = -1 * game.ball.speed.y;
        game.ball.y += game.ball.speed.y * game.ball.acc_coef;
    }

    if (danger_left_area(game)) {
        if (!is_in_player(game.ball, game.player)) {
            game.player.lost += 1;
            game.ball.speed.x = -1 * game.ball.speed.x;
            reset(game)
        } else {
            game.ball.speed.x = -1 * game.ball.speed.x;
            game.ball.x += game.ball.speed.x * game.ball.acc_coef;
        }
    }

    if (danger_right_area(game)) {
        if (!is_in_player(game.ball, game.computer)) {
            game.computer.lost += 1;
            game.ball.speed.x = -1 * game.ball.speed.x;
            reset(game)
        } else {
            game.ball.speed.x = -1 * game.ball.speed.x;
            game.ball.x += game.ball.speed.x * game.ball.acc_coef;
        }
    }
}

function danger_right_area(game) {
    return game.ball.x > game.canvas.width - game.ball.r*2;
}

function danger_left_area(game) {
    return game.ball.x < game.ball.r*2;
}

function is_in_player(ball, player) {
    return player.y < ball.y && ball.y < player.y + PLAYER_HEIGHT;
}

function runAnimation(area, ctx, game) {
    animate(game)
    draw(area, ctx, game)
    requestAnimationFrame(() => runAnimation(area, ctx, game))
}

function computePlayerPosition(game, mouse_y) {
    // let the cursor be complete
    if (mouse_y < PLAYER_HEIGHT / 2) {
        game.player.y = 0;
    } else if (mouse_y > game.canvas.height - PLAYER_HEIGHT / 2) {
        game.player.y = game.canvas.height - PLAYER_HEIGHT;
    } else {
        // We want to control the position from the middle of the cursor
        game.player.y = mouse_y - PLAYER_HEIGHT / 2;
    }
}

function reset(game) {
    game.ball.x = game.canvas.width / 2;
    game.ball.y = game.canvas.height / 2;
    game.player.y = game.canvas.height / 2 - PLAYER_HEIGHT / 2;
}

window.addEventListener('DOMContentLoaded', () => {
    const canvas_elt = document.querySelector( "#pong-area" );
    const ctx = canvas_elt.getContext('2d');
    const canvas_rect = canvas_elt.getBoundingClientRect();

    const game = {
        player: {
            y: canvas_elt.height / 2 - PLAYER_HEIGHT / 2,
            lost: 0,
            win: 0,
        },
        computer: {
            y: canvas_elt.height / 2 - PLAYER_HEIGHT / 2,
            lost: 0,
            win: 0,
        },
        canvas: {
            y: canvas_rect.y,
            height: canvas_rect.height,
            width: canvas_rect.width - canvas_rect.x,
        },
        ball: {
            x: canvas_elt.width / 2,
            y: canvas_elt.height / 2,
            r: 5,
            speed: {
                x: 2,
                y: 2
            },
            acc_coef: 0.85,
        }
    }

    canvas_elt.addEventListener('mousemove', e => {
        computePlayerPosition(game, e.clientY - game.canvas.y)
    })

    draw(canvas_elt, ctx, game)
    runAnimation(canvas_elt, ctx, game)
});