var SurveyGroup = function(gid, name, surveys)
{
	var self = this;
	self.groupId = gid;
	self.groupName = ko.observable(name);
	self.surveys = ko.observableArray(surveys);
}

var Survey = function(id, gid, name, description) 
{
	var self = this;
	self.surveyId = id,
	self.surveyGroupId = ko.observable(gid),
	self.surveyName = ko.observable(name);
	self.surveyDescription = ko.observable(description);
	self.surveyQuestions = ko.observableArray();
};

var SurveyQuestion = function(question, type, values)
{
	var self = this;
	self.questionText = ko.observable(question);
	self.type = ko.observable(type);
	self.values = ko.observable(values);
};

var SurveysViewModel = function()
{
	var self = this;
	
	// Data
	self.chosenSurveyId = ko.observable();
	self.chosenSurveyData= ko.observable();
	
	self.surveyGroups = ko.observableArray(
	[
		new SurveyGroup("1", "HSQE", 
		[
			new Survey("1", "1", "Survey 1", "The first survey"),
			new Survey("2", "1", "Survey 2", "The second survey")
		]),
		new SurveyGroup("2", "O&M", 
		[
			new Survey("3", "2", "Survey 3", "The third survey")
		])
	]);
	
	self.listView =  ko.observable(true);
	
	
	// Behaviours	
	self.goToSurvey = function(survey)
	{
		location.hash =  survey.surveyGroupId() + "/" + survey.surveyId;
	};
	
	self.goToSurveyList = function()
	{
		location.hash = "";
	};
	
	self.addNewQuestion = function()
	{
		self.chosenSurveyData().surveyQuestions.push(new SurveyQuestion(null, null, null));
	};
	
	//Utilities
	
	self.getSurveyById = function(gid, id)
	{
		var gp = ko.utils.arrayFirst(self.surveyGroups(), function(group)
		{
			return group.groupId === gid ;
		});
		return (gp ? ko.utils.arrayFirst(gp.surveys(), function(survey)
		{
			return survey.surveyId === id;
		}) : null);
	};
	
	// Client-side routes
	Sammy(function() 
	{
		this.get("#:group/:survey", function() 
		{
			self.chosenSurveyData(self.getSurveyById(this.params.group, this.params.survey));
			self.chosenSurveyId(this.params.survey);
			self.listView(null);
			$('.carousel').carousel(1);
		});
		
		this.get("", function() 
		{ 
			self.chosenSurveyId(null);
			//self.chosenSurveyData(null);
			self.listView(true);
			$('.carousel').carousel(0);
		});
    }).run();
}
 
ko.applyBindings(new SurveysViewModel());