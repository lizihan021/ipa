# Research Ideas For IPA Platform
Walter's previous research determined the best way to synthesize input from crowd sourced workers (Legion Paper). The next step would be to extend that research to the IPA Platform.

We know which method to synthesize the crowd control of the robot navigation. The analogous systems for visual recognition and conversation have also been determined. The natural next step is to figure out how all of these methods will combine. There are some considerations:
1. All 3 systems cannot be completely isolated, data must be shared between them for completion of tasks. The systems don't need to be completely integrated either. For example, the group of workers holding conversation with the user can highlight important data or a task for the visual recognition workers or the navigating worker to complete.
2. Need to make sure that new navigators have an idea of what the mission is or maybe even just path to follow.
3. How is information shared? Do we have the conversation group select and organize data, then forward only what the navigators need.


My first idea is to have a pool of workers handling the conversation but also aware of the navigation that is occurring. When the current driver fails, replace with the next highest rated from the pool of workers. That way the worker now navigating is aware of the task and can continue driving without interruption.

It might be better to keep the navigation really simple. That way navigation doesn't have to multitask and we get better overall performance.
 - "here is a building map. drive here"
 - "follow the user"
 - et cetera

We can give the conversation group two UIs. One for conversation with the user. One for sending filtered (simple) data to the navigation crew. The navigation group gets two UIs as well. Visual and control feed. Another for viewing the filtered data from the conversation. All of the information will be in the conversation history, therefore the conversation group is sort of like the brain of the system. One draw back for this system, however, is the delay between conversation --> synthesizing info for nav team --> nav team responding.

This delay seems less of an issue for the robot navigation but more of an issue for peripheral control (if we had a robot arm). To help mitigate this we can abstract one level up and create "intelligence team." Consisting of one team dedicated to conversation. Another team also reading the conversation but selecting and filtering the information to send to the nav team. The obvious problem with abstracting once more is the increase in number of workers and therefore cost to operate. 
