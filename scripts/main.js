const AECONSTS = {
    MN: "automated-evocations",
    animationFunctions: {
        "fire": {
            fn: async (template,tokenData) => {
                await new Sequence()
                    .effect()
                        .file("modules/automated-evocations/assets/animations/fire_spiral_CIRCLE_01.webm")
                        .belowTokens()
                        .randomRotation()
                        .atLocation(template)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.35)
                    .wait(750)
                    .effect()
                        .file("modules/automated-evocations/assets/animations/fire_earth_explosion_CIRCLE_01.webm")
                        .belowTokens()
                        .randomRotation()
                        .atLocation(template)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.35)
                .play()
            },
            time: 1000
        },
        "air": {
            fn: async (template,tokenData) => {
                await new Sequence()
                    .effect()
                        .file("modules/automated-evocations/assets/animations/air_infinity_RECTANGLE_01.webm")
                        .belowTokens()
                        .atLocation(template)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.35)
                    .wait(750)
                    .effect()
                        .file("modules/automated-evocations/assets/animations/air_portal_CIRCLE_01.webm")
                        .belowTokens()
                        .randomRotation()
                        .atLocation(template)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.35)
                    .wait(750)
                    .effect()
                        .file("modules/automated-evocations/assets/animations/air_puff_CIRCLE_01.webm")
                        .belowTokens()
                        .randomRotation()
                        .atLocation(template)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.35)
                .play()
            },
            time: 1650
        },
        "lightning": {
            fn: async (template,tokenData) => {
                await new Sequence()
                    .effect()
                        .file("modules/automated-evocations/assets/animations/ring_CIRCLE_01.webm")
                        .belowTokens()
                        .randomRotation()
                        .atLocation(template)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.55)
                    .wait(750)
                    .effect()
                        .file("modules/automated-evocations/assets/animations/electric_blast_01.webm")
                        .belowTokens()
                        .randomRotation()
                        .atLocation(template)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.35)
                        .repeats(6, 100, 170, 250, 320, 400)
                .play()
            },
            time: 1650
        },
        "water": {
            fn: async (template,tokenData) => {
                await new Sequence()
                    .effect()
                        .file("modules/automated-evocations/assets/animations/water_blast_RAY_01.webm")
                        .belowTokens()
                        .randomRotation()
                        .atLocation(template)
                        .repeats(6, 50, 25, 75, 60, 20)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.55)
                    .wait(500)
                    .effect()
                        .file("modules/automated-evocations/assets/animations/create_water_CIRCLE_01.webm")
                        .belowTokens()
                        .randomRotation()
                        .atLocation(template)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.35)
                .play()
            },
            time: 1000
        },
        "energy1": {
            fn: async (template,tokenData) => {
                await new Sequence()
                    .effect()
                        .file("modules/automated-evocations/assets/animations/energy_spark_CIRCLE_01.webm")
                        .belowTokens()
                        .randomRotation()
                        .atLocation(template)
                        .randomOffset()
                        .repeats(6, 50, 25, 75, 60, 20)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.15)
                    .wait(500)
                    .effect()
                        .file("modules/automated-evocations/assets/animations/energy_pulse_yellow_CIRCLE.webm")
                        .belowTokens()
                        .atLocation(template)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.35)
                .play()
            },
            time: 650
        },
        "magic1": {
            fn: async (template,tokenData) => {
                await new Sequence()
                    .effect()
                        .file("modules/automated-evocations/assets/animations/magic_explosion_symbol_CIRCLE.webm")
                        .belowTokens()
                        .atLocation(template)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.35)
                .play()
            },
            time: 1150
        },
        "heart": {
            fn: async (template,tokenData) => {
                await new Sequence()
                    .effect()
                        .file("modules/automated-evocations/assets/animations/heart_red_SQUARE.webm")
                        .atLocation(template)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.35)
                .play()
            },
            time: 400
        },
        "music": {
            fn: async (template,tokenData) => {
                await new Sequence()
                    .effect()
                        .file("modules/automated-evocations/assets/animations/music_RECTANGLE.webm")
                        .belowTokens()
                        .randomRotation()
                        .atLocation(template)
                        .randomOffset()
                        .repeats(6, 150, 225, 375, 460, 520)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.25)
                    .wait(900)
                    .effect()
                        .file("modules/automated-evocations/assets/animations/magic_symbol_SQUARE_05.webm")
                        .belowTokens()
                        .atLocation(template)
                        .scale(Math.max(tokenData.width,tokenData.height)*0.35)
                .play()
            },
            time: 1350
        },
        "fourelements": {
            fn: async (template,tokenData) => {
                await new Sequence()
                    .effect()
                        .file("modules/automated-evocations/assets/animations/four_element_strike_SQUARE_01.webm")
                        .atLocation(template)
                        .belowTokens()
                        .scale(Math.max(tokenData.width,tokenData.height)*0.35)
                .play()
            },
            time: 700
        },

    }
}