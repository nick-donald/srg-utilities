class ArticlesMailer < ActionMailer::Base
  include ArticleGrabber

  default from: "info@srginsight.com"

  def mail_articles
    puts 'in mail_articles'
    @articles = get_articles
    mail(to: 'nickjdonald@gmail.com', subject: "Today's Articles")
  end
end
