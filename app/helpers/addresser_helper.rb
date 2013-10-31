module AddresserHelper
	require 'rubygems'
	require 'open-uri'
	require 'geocoder'
	require 'json'
	require 'simple_xlsx'
	require 'spreadsheet'
	require 'roo'

	def addresser(query, inputCity, radius)

		time = Time.new

		@info = {}

		@results_output = []

		query_formatted = query.split(/,{1}\s*/)

		@info["Retailers"] = query_formatted

		$retailers_string = query_formatted.join("_")

		@info["City"] = inputCity

		$city = inputCity

		@info["Radius"] = radius

		radius = radius.to_i * 1609

		s = Geocoder.search(inputCity)

		api_key = 'AIzaSyD9nMao2MhG-koTmFrm0oeGMe3MT4kFy5k'

		# query_formatted = "Target"

		results_group = []

		count = 0;

		query_formatted.each do |q|

			q.gsub!(/\s/, "%22")

			puts "Searching #{q} in #{inputCity}..."
			
			uri = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{s.first.latitude},#{s.first.longitude}&radius=#{radius}&name=#{q}&sensor=false&key=AIzaSyCi1M9jpPjCTi6HlZBEC4gza5F7SR7lwIo"

			puts uri

			obj = open(uri).read

			object = JSON.parse(obj)

			results = object["results"]

			results_push = []
			results_uniq = {}

			results.each do |result|
				vicinity = result["vicinity"]
				if result["types"].include? "store"
					if !results_uniq[vicinity]
						results_uniq[vicinity] = 1

						results_push << result
					end
				end
			end

			@results_output[count] = results_push

			count += 1

			sleep 0.5

		end

		# results_group.empty? puts "No results"

		# SimpleXlsx::Serializer.new("#{Rails.root}/public/uploads/test-#{time}.xlsx") do |doc|
		# 	doc.add_sheet("Results") do |sheet|
		# 		sheet.add_row(%w{Store Vicinity})

		# 		result_uniq = {}

		# 		results_group.each do |store|
		# 			store.each do |r|
		# 				if r["types"].include? "store"
		# 					if !result_uniq[r["vicinity"]]
		# 						result_uniq[r["vicinity"]] = 1
		# 						sheet.add_row([r["name"], r["vicinity"]])
		# 					end
		# 				end
		# 			end
		# 		end
		# 	end
		# end
		@info["status"] = "success"

		return @info, @results_output
	end

	def detail_finder(data)
		results = data["response"]

		@return_group = []

		count = 0;

		for i in 0...results.count
			num = i.to_s
			for j in 0...results[num].count
				
				num_j = j.to_s
				ref = results[num][num_j]["reference"]

				uri = "https://maps.googleapis.com/maps/api/place/details/json?reference=#{ref}&sensor=false&key=AIzaSyCi1M9jpPjCTi6HlZBEC4gza5F7SR7lwIo"

				obj = open(uri).read

				object = JSON.parse(obj)

				if (j == 0) 
					puts object
				end

				@return_group << object["result"]["formatted_phone_number"]

				sleep 0.5

			end
		end


		return @return_group
	end

	def assemble_excel(data)

		time = Time.new

		headers = data["columns"]

		length = data["results"].count

		@filepath = "#{Rails.root}/public/uploads/#{$retailers_string}_#{$city}_spreadsheet.xlsx"

		SimpleXlsx::Serializer.new(@filepath) do |doc|
			doc.add_sheet("Results") do |sheet|
				sheet.add_row(headers)

				data["results"].each do |result|
					row_data = []
					result[1].each do |k,v|
						row_data << v
					end
					sheet.add_row(row_data)
				end
			end
		end

		
		return @filepath
	end

	def maps
		puts "hi"
		
	end

	def mapOutput(filepath)

		@output = []

		re = /(?:\.)(\w+)$/i

		fExtension = re.match(filepath)[1]
		
		if fExtension == 'xls'
			book = Roo::Excel.new(filepath)
		elsif fExtension == 'xlsx'
			book = Roo::Excelx.new(filepath)
		end

		book.default_sheet = book.sheets.first

		for i in book.first_column..book.last_column
			@output << book.cell(1, i)
		end

		puts @output

		return @output
	end
end
