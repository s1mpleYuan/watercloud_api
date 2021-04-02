function printPromptInfo(title, context) {
	// for (let i = 0; i < 7; i++) {
	// 	switch (i) {
	// 		case 0:
	// 		case 4: 
	// 		case 6: console.log('#######################################################');
	// 			break;
	// 		case 1: 
	// 		case 3: console.log('\n');
	// 			break;
	// 		case 2: console.log('     %s', title);
	// 		case 5: console.log(context);
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// }
	console.log(`#################################################
%s
%s

#################################################`, title, context);
}




module.exports.printPromptInfo = printPromptInfo;
