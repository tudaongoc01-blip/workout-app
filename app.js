const workoutProgram = {
    "Day 1": {
        title: "Day 1: Upper Body (Heavy)",
        type: "workout",
        exercises: [
            { name: "BB Bench Press", sets: 3, reps: "8-10" },
            { name: "Incline DB Bench Press (Neutral Grip)", sets: 3, reps: "6-8" },
            { name: "Pendlay Row (hoặc Seated Cable Row)", sets: 4, reps: "6-8" },
            { name: "Pull Up (hoặc Lat Pull Down)", sets: 3, reps: "6-8" },
            { name: "OHP (Military Press)", sets: 3, reps: "8-10" },
            { name: "Barbell Curl", sets: 3, reps: "6-8" },
            { name: "Close Grip Bench Press (hoặc Dips)", sets: 3, reps: "6-8" },
            { name: "DB Shrug", sets: 3, reps: "6-8" }
        ]
    },
    "Day 2": {
        title: "Day 2: Lower Body (Heavy)",
        type: "workout",
        exercises: [
            { name: "Squat", sets: 5, reps: "6" },
            { name: "Leg Press", sets: 5, reps: "6" },
            { name: "Sumo Deadlift (hoặc Conventional DL)", sets: 5, reps: "5" },
            { name: "Stiff Leg Deadlift (hoặc DB RDL)", sets: 3, reps: "6-8" },
            { name: "Lunges", sets: 3, reps: "6-8" },
            { name: "Standing Calf Raise", sets: 4, reps: "15-20" },
            { name: "Abs 1 (Hanging / Lying Leg Raise)", sets: 4, reps: "8-12" },
            { name: "Abs 2 (Machine / Floor Crunches)", sets: 4, reps: "8-12" }
        ]
    },
    "Day 3": {
        title: "Day 3: Rest Day",
        type: "rest",
        message: "Ngày nghỉ hoàn toàn. Hãy tập trung ăn uống đủ chất và ngủ đủ giấc để phục hồi cơ bắp![cite: 6]"
    },
    "Day 4": {
        title: "Day 4: Upper Body (Hypertrophy)",
        type: "workout",
        exercises: [
            { name: "Incline BB Bench Press", sets: 3, reps: "8-12" },
            { name: "Butterfly (hoặc DB Flys)", sets: 3, reps: "12" },
            { name: "Pull Up", sets: 3, reps: "8-12" },
            { name: "Rowing with DB", sets: 3, reps: "8-12" },
            { name: "OHP (Military Press)", sets: 3, reps: "6-8" },
            { name: "Bent Over Lateral Raise", sets: 3, reps: "8-12" },
            { name: "DB Curl", sets: 3, reps: "8-12" },
            { name: "Skull Crusher", sets: 3, reps: "8-12" }
        ]
    },
    "Day 5": {
        title: "Day 5: Lower Body (Hypertrophy)",
        type: "workout",
        exercises: [
            { name: "Squat", sets: 4, reps: "6-10" },
            { name: "Leg Press", sets: 4, reps: "8-10" },
            { name: "Sumo Deadlift", sets: 3, reps: "6-10" },
            { name: "Stiff Leg Deadlift", sets: 3, reps: "8-12" },
            { name: "Lunges", sets: 3, reps: "8-12" },
            { name: "Standing Calf Raise", sets: 5, reps: "15-20" },
            { name: "Abs 1 (Leg Raises)", sets: 4, reps: "8-12" },
            { name: "Abs 2 (Crunches)", sets: 4, reps: "8-12" }
        ]
    },
    "Day 6": {
        title: "Day 6: Rest Day",
        type: "rest",
        message: "Ngày nghỉ phục hồi![cite: 9]"
    },
    "Day 7": {
        title: "Day 7: Rest or Cardio 30M",
        type: "rest",
        message: "Nghỉ ngơi hoặc tập LISS Cardio nhẹ nhàng 30 phút (chạy bộ, đi bộ, đạp xe...)[cite: 9]."
    }
};

let currentDay = "Day 1";

function initApp() {
    renderDaySelector();
    renderWorkout(currentDay);
}

function renderDaySelector() {
    const container = document.getElementById("daySelector");
    container.innerHTML = "";
    Object.keys(workoutProgram).forEach(dayKey => {
        const btn = document.createElement("button");
        btn.className = `day-btn ${dayKey === currentDay ? 'active' : ''}`;
        btn.innerText = dayKey;
        btn.onclick = () => {
            currentDay = dayKey;
            renderDaySelector();
            renderWorkout(currentDay);
        };
        container.appendChild(btn);
    });
}

function renderWorkout(dayKey) {
    const container = document.getElementById("workoutContainer");
    container.innerHTML = "";

    const data = workoutProgram[dayKey];

    if (data.type === "rest") {
        container.innerHTML = `
            <div class="rest-day">
                <h2>${data.title}</h2>
                <p>${data.message}</p>
            </div>
        `;
        return;
    }

    data.exercises.forEach((ex, exIdx) => {
        const card = document.createElement("div");
        card.className = "exercise-card";

        let setsHTML = "";
        for (let s = 1; s <= ex.sets; s++) {
            const savedData = getSavedSetData(dayKey, exIdx, s);
            setsHTML += `
                <div class="set-row">
                    <span class="set-label">Hiệp ${s}</span>
                    <input type="number" id="weight_${dayKey}_${exIdx}_${s}" placeholder="kg" value="${savedData.weight || ''}">
                    <input type="number" id="reps_${dayKey}_${exIdx}_${s}" placeholder="reps" value="${savedData.reps || ''}">
                    <button class="check-btn ${savedData.done ? 'done' : ''}" onclick="toggleCheck('${dayKey}', ${exIdx}, ${s})">
                        ✓
                    </button>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="exercise-title">${ex.name}</div>
            <div class="exercise-meta">${ex.sets} Working Sets × Target: ${ex.reps} Reps</div>
            ${setsHTML}
        `;
        container.appendChild(card);
    });
}

function getSavedSetData(day, exIdx, setNum) {
    const key = `workout_${day}_${exIdx}_${setNum}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : { weight: "", reps: "", done: false };
}

function toggleCheck(day, exIdx, setNum) {
    const weightVal = document.getElementById(`weight_${day}_${exIdx}_${setNum}`).value;
    const repsVal = document.getElementById(`reps_${day}_${exIdx}_${setNum}`).value;
    const btn = event.target;

    const isDone = !btn.classList.contains("done");
    if (isDone) {
        btn.classList.add("done");
    } else {
        btn.classList.remove("done");
    }

    const key = `workout_${day}_${exIdx}_${setNum}`;
    localStorage.setItem(key, JSON.stringify({
        weight: weightVal,
        reps: repsVal,
        done: isDone
    }));
}

document.addEventListener("DOMContentLoaded", initApp);