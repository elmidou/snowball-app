Template.post_vote.helpers({
  //enableDownvotes: function () {
  //  return Settings.get("enableDownvotes", false);
  //}, actionsClass: function () {
  //  var user = Meteor.user();
  //  var actionsClass = "";
  //  if (!user) return false;
  //  if (user.hasUpvoted(this)) {
  //    actionsClass += " voted upvoted";
  //  }
  //  if (user.hasDownvoted(this)) {
  //    actionsClass += " voted downvoted";
  //  }
  //  if (Settings.get("enableDownvotes", false)) {
  //    actionsClass += " downvotes-enabled";
  //  }
  //  return actionsClass;
  //}
  hasVoted: function () {
    return Users.hasUpvoted(Meteor.user(), this) || Users.hasDownvoted(Meteor.user(), this);
  },
  upvotePercent: function () {
    var totalVotes = this.upvotes + this.downvotes;
    return 100 * (this.upvotes / totalVotes ) + '%';
  },
  downvotePercent: function () {
    var totalVotes = this.upvotes + this.downvotes;
    return 100 * (this.downvotes / totalVotes) + '%';
  }
});
Template.post_vote.events({
  'click .upvote': function (e) {
    var post = this;
    var user = Meteor.user();
    e.preventDefault();
    if (!user) {
      FlowRouter.go('signIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    } else if (!user.hasUpvoted(post) && !user.hasDownvoted(post)) {
      Meteor.call('upvotePost', post._id, function () {
        Events.track("post upvoted", {'_id': post._id});
      });
    }
  },
  'click .downvote': function (e) {
    var post = this;
    var user = Meteor.user();
    e.preventDefault();
    if (!user) {
      FlowRouter.go('atSignIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    }
    if (!user.hasUpvoted(post) && !user.hasDownvoted(post)) {
      Meteor.call('cancelDownvotePost', post._id, function () {
        Events.track("post downvote cancelled", {'_id': post._id});
      });
      Meteor.call('downvotePost', post._id, function () {
        Events.track("post downvoted", {'_id': post._id});
      });
    }
  }
}); 