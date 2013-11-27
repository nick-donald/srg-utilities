class ArticlesMailer < ActionMailer::Base
  include ArticleGrabber

  default from: "info@srginsight.com"

  def mail_articles
      
  end
end
