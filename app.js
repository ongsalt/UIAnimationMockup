const app = document.getElementById('app')
const device = document.getElementById('device')
const appClip = document.getElementById('app-clip')
const statusBar = document.getElementById('statusbar')
const icon = document.getElementById('app-icon-content')
const navbar = document.getElementById('navbar-area')
const home = document.getElementById('home')
const bg = document.getElementById('bg')
const appGrid = document.getElementById('app-grid')
const swicthOnHome = document.getElementById('switch-onhome')

const appHeight = bg.clientHeight

const appTransition = 'all .6s var(--easing), opacity 0s, height .6s var(--easing2)'

const State = {
    isOnHome: false,
    isLaunching: false,
    isDragging: false,
    startingPoint: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    lastEventTime: Date.now(),
    iconBoundary: getIconBoundary()
}

swicthOnHome.addEventListener('click', () => {
    State.isOnHome = !State.isOnHome
    updateHomeState()
})

// I donct wknow other wvent
swicthOnHome.addEventListener('touchend', () => {
    State.isOnHome = !State.isOnHome
    updateHomeState()
})

icon.addEventListener('click', () => {
    State.isOnHome = false
    updateHomeState()
})

icon.addEventListener('touchend', () => {
    State.isOnHome = false
    updateHomeState()
})

function getIconBoundary() {
    const a = icon.getClientRects()[0]
    const b = bg.getClientRects()[0]

    console.log(a)
    console.log(b)

    return {
        x: (a.x + icon.clientWidth / 2) - (b.x + bg.clientWidth / 2),
        y: a.bottom - (b.bottom) + (appHeight / (bg.clientWidth / 42) - 42), // shift down by the amount of the rest
        xb: - (a.x + icon.clientWidth / 2) + (b.x + bg.clientWidth / 2),
        yb: - a.top + b.top,
    }
}

function launchAnimation() {
    app.style.scale = 1
    app.style.translate = `0px 0px`
}

function transform() {
    app.style.transition = 'all .05s linear'
    icon.style.transition = 'all .05s linear'

    // Should be gradually harder to drag after reached certain point
    const scale = Math.max((1 + (State.offset.y / 400)), 0.2) // Move upward is negative
    app.style.scale = scale
    icon.style.scale = scale * (app.clientWidth / 42)

    const posY = appHeight - (-State.offset.y) - appHeight * scale
    console.log(scale)
    app.style.translate = `${State.offset.x}px ${State.offset.y}px`
    icon.style.translate = `${State.iconBoundary.xb + State.offset.x}px ${State.iconBoundary.yb + posY}px`


}

function onDragCanceled() {
    if (State.offset.y < -200) {
        // Should do some physics
        // app.style.transformOrigin = ''
        State.isOnHome = true
        updateHomeState()
    } else {
        app.style.transition = 'all .5s'
        app.style.scale = 1
        app.style.translate = `0px 0px`
        icon.style.translate = `${State.iconBoundary.xb}px ${State.iconBoundary.yb}px`
    }
}

function updateHomeState() {
    if (!State.isOnHome) {
        bg.style.filter = 'blur(12px)'
        bg.style.scale = '1.2'
        statusBar.style.color = 'black'

        icon.style.scale = (app.clientWidth / 42)
        icon.style.transition = appTransition
        icon.style.translate = `${State.iconBoundary.xb}px ${State.iconBoundary.yb}px`
        icon.style.height = `${19.5 / 9 * 42}px`
        console.log(`${19.5 / 9 * 42}px`)

        setTimeout(() => {
            app.style.opacity = 1
            icon.style.opacity = 0
        }, 100)

        app.style.pointerEvents = 'auto'
        appClip.style.height = '100%'
        app.style.transition = appTransition


        launchAnimation()

        // app.style.display = ''
    } else {
        bg.style.scale = '1'
        bg.style.filter = 'blur(0px)'
        statusBar.style.color = 'white'
        app.style.pointerEvents = 'none'

        icon.style.transition = appTransition
        icon.style.scale = 1
        icon.style.height = '42px'
        icon.style.translate = `0 0`

        setTimeout(() => {
            app.style.opacity = 0
            icon.style.opacity = 1
        }, 250)

        // app.style.opacity = 0.5
        app.style.scale = (42 / app.clientWidth)
        app.style.transition = appTransition
        app.style.translate = `${State.iconBoundary.x}px ${State.iconBoundary.y}px`
        console.log(State.iconBoundary)
        appClip.style.height = '46.153846153%'

        // app.style.display = 'none'
    }
}


const onStart = event => {
    event.preventDefault()
    State.isDragging = true
    if (event.touches) {
        State.startingPoint.x = event.touches[0].screenX
        State.startingPoint.y = event.touches[0].screenY
    } else {
        State.startingPoint.x = event.screenX
        State.startingPoint.y = event.screenY
    }
}

const onEnd = event => {
    event.preventDefault()
    if (State.isDragging) {
        onDragCanceled()
        State.offset.x = 0
        State.offset.y = 0
    }
    State.isDragging = false
}

const onDrag = event => {
    if (State.isDragging) {
        if (event.touches) {
            State.offset.x = event.touches[0].screenX - State.startingPoint.x
            State.offset.y = event.touches[0].screenY - State.startingPoint.y
        } else {
            State.offset.x = event.screenX - State.startingPoint.x
            State.offset.y = event.screenY - State.startingPoint.y
        }

        // Filter some event
        const now = Date.now()
        if (now - State.lastEventTime >= 50) {
            transform()
            State.lastEventTime = now
        }
    }
}

navbar.addEventListener('mousedown', onStart)
navbar.addEventListener('touchstart', onStart)

document.addEventListener('mouseup', onEnd)
document.addEventListener('touchend', onEnd)

document.addEventListener('mousemove', onDrag)
document.addEventListener('touchmove', onDrag)

app.style.transformOrigin = 'bottom'
icon.style.transformOrigin = 'top'
appClip.style.transition = 'all .6s var(--easing)'
icon.style.transition = 'all .6s var(--easing)'

updateHomeState()

console.log(State.iconBoundary)

// ----------------- Config
