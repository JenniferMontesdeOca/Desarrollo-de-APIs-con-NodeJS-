import fs from "fs-extra";  // Manejo de archivos JSON
import chalk from "chalk";  // Colores en la terminal
import prompts from "prompts";  // Entrada del usuario

// Archivo donde se guardan las tareas
const TASKS_FILE = "tasks.json";

// Función para cargar las tareas desde el archivo JSON
const loadTasks = async () => {
  try {
    return await fs.readJson(TASKS_FILE);
  } catch (error) {
    return [];
  }
};

// Función para guardar las tareas en el archivo JSON
const saveTasks = async (tasks) => {
  await fs.writeJson(TASKS_FILE, tasks, { spaces: 2 });
};

// Función para agregar una tarea
const addTask = async () => {
  const response = await prompts({
    type: "text",
    name: "task",
    message: "Escribe la tarea a agregar:"
  });

  if (!response.task) return;

  const tasks = await loadTasks();
  tasks.push({ text: response.task, completed: false });
  await saveTasks(tasks);

  console.log(chalk.green("✅ Tarea agregada correctamente."));
};

// Función para listar las tareas
const listTasks = async () => {
  const tasks = await loadTasks();

  console.log(chalk.blue("\n📋 Lista de tareas:"));
  tasks.forEach((task, index) => {
    const status = task.completed ? chalk.green("✔") : chalk.red("✖");
    console.log(`${status} ${chalk.bold(index + 1)}. ${task.text}`);
  });

  console.log("");
};

// Función para marcar una tarea como completada
const completeTask = async () => {
  const tasks = await loadTasks();

  if (tasks.length === 0) {
    console.log(chalk.yellow("⚠ No hay tareas para completar."));
    return;
  }

  const response = await prompts({
    type: "number",
    name: "index",
    message: "Ingrese el número de la tarea a marcar como completada:",
    validate: value => (value > 0 && value <= tasks.length) ? true : "Número inválido"
  });

  if (response.index) {
    tasks[response.index - 1].completed = true;
    await saveTasks(tasks);
    console.log(chalk.green("✅ Tarea marcada como completada."));
  }
};

// Menú principal
const mainMenu = async () => {
  while (true) {
    const response = await prompts({
      type: "select",
      name: "action",
      message: "¿Qué deseas hacer?",
      choices: [
        { title: "Agregar tarea", value: "add" },
        { title: "Listar tareas", value: "list" },
        { title: "Marcar como completada", value: "complete" },
        { title: "Salir", value: "exit" }
      ]
    });

    switch (response.action) {
      case "add":
        await addTask();
        break;
      case "list":
        await listTasks();
        break;
      case "complete":
        await completeTask();
        break;
      case "exit":
        console.log(chalk.blue("👋 Saliendo del gestor de tareas..."));
        return;
    }
  }
};

// Iniciar la aplicación
mainMenu();
