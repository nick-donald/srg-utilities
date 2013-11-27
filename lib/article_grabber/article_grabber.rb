module ArticleGrabber
  require 'open-uri'
  require 'nokogiri'
  require 'date'
  require 'net/smtp'

  def get_articles
    url = 'https://news.google.com/news/feeds?q=burt+flickinger&output=rss'
    doc = Nokogiri::HTML(open(url))
    now = DateTime.now

    titles = []
    descriptions =[]
    dates = []

    doc.xpath('//item/title').each do |el|
        titles << el.content
    end

    doc.xpath('//item/description').each do |el|
        descriptions << el.content
    end

    doc.xpath('//item/pubdate').each do |el|
        dates << el.content
    end

    dates.each_with_index do |date, index|
        if DateTime.rfc2822(date) > DateTime.new(now.year,now.month,(now.day - 1),00,00,00,"GMT")
            message += descriptions[index]
        end
    end
  end

end