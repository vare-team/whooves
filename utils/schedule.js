/**
 * @function
 * @author KoloMl
 * All in one tasks schedule module
 */
module.exports = function (sendLog) {
	let counter = 0,
		queue = {},
		tasks = {},
		timer = null,
		nextTaskExecution = null;
	/**
	 * Function for register new task type for execution
	 * Gets task object as parameter
	 *
	 * @param {Object} taskObject - Main task object
	 * @param {string} taskObject.code - Task code for future execution
	 * @param {function} taskObject.execute - Function which will be executed
	 */
	this.registerTask = taskObject => {
		const taskCode = taskObject.code;
		if (tasks.hasOwnProperty(taskCode)) {
			sendLog(`task.${taskCode} is already exist!`, 'error');
			return;
		}
		tasks[taskCode] = taskObject.execute;
		sendLog(`task.${taskCode} registered!`);
	};

	/**
	 * Function for include new queued task
	 *
	 * @param {{code: string, timeAbsolute: boolean, time: Date, params: *[]}} pushTaskObject - New task information
	 * @param {string} pushTaskObject.code - Internal task code
	 * @param {Array} [pushTaskObject.params] - Parameters for function
	 * @param {number} pushTaskObject.time - Time parameter
	 * @param {boolean} [pushTaskObject.timeAbsolute] - Relative / Absolute time type
	 */
	this.pushTask = pushTaskObject => {
		if (!pushTaskObject.timeAbsolute) pushTaskObject.time = Date.now() + pushTaskObject.time;
		queue[counter++] = {
			code: pushTaskObject.code,
			params: pushTaskObject.params ? pushTaskObject.params : [],
			time: pushTaskObject.time,
			processed: false,
		};
		resetTimer();
	};

	/**
	 * Internal function which gets tasks to execute
	 *
	 * @param { * | boolean } doNotProcess - Flag for not processing tasks
	 * @return {{next: *, now: *}}
	 */
	const getTasks = doNotProcess => {
		const tasksToRun = [];
		let nextTaskTimer = null;
		const now = +new Date();
		for (const taskIndex in queue) {
			const currentTask = queue[taskIndex];
			if (currentTask.time < now && !doNotProcess) {
				tasksToRun.push(taskIndex);
				currentTask.processed = true;
				continue;
			}
			if ((!nextTaskTimer || currentTask.time < nextTaskTimer) && !currentTask.processed)
				nextTaskTimer = currentTask.time;
		}
		return { next: nextTaskTimer, now: tasksToRun };
	};

	/**
	 * Function for timer
	 *
	 * @return {Promise<void>}
	 */
	const process = async () => {
		const currentTasks = getTasks();
		for (let index = 0, length = currentTasks.now.length; index < length; index++) {
			const queueIndex = currentTasks.now[index];
			const queueTask = queue[queueIndex];
			if (!tasks.hasOwnProperty(queueTask.code)) {
				sendLog(`Trying to execute unavailable task: ${queueTask.code}.`, 'error');
				continue;
			}
			tasks[queueTask.code](...queueTask.params);
			delete queue[queueIndex];
		}
		resetTimer(currentTasks);
	};

	/**
	 * Function for reset schedule timer
	 *
	 * @param { * | Object } tasksObject - Possible object from process function
	 * @param {number} tasksObject.next - time for next timer
	 */
	const resetTimer = tasksObject => {
		let currentTasks = tasksObject;
		if (!currentTasks) currentTasks = getTasks(true);
		if (currentTasks.next && isFinite(currentTasks.next)) {
			nextTaskExecution = currentTasks.next;
			clearTimeout(timer);
			timer = setTimeout(process, currentTasks.next - Date.now());
		}
	};
};
