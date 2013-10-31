module supermarket_addresser
	def addresser(query, inputCity, radius)

		query_formatted = query.split(", ")

		radius = radius * 1609

		s = Geocoder.search(inputCity)

		api_key = 'AIzaSyD9nMao2MhG-koTmFrm0oeGMe3MT4kFy5k'

		# query_formatted = "Target"

		results_group = []

		query_formatted.each do |q|

			puts "Searching #{q} in #{inputCity}..."
			
			uri = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{s.first.latitude},#{s.first.longitude}&radius=#{radius}&name=#{q}&sensor=false&key=AIzaSyCi1M9jpPjCTi6HlZBEC4gza5F7SR7lwIo"

			obj = open(uri).read

			object = JSON.parse(obj)

			results = object["results"]

			results_group << results

			sleep 0.5

		end

		# results_group.empty? puts "No results"

		send_file SimpleXlsx::Serializer.new("test1.xlsx") do |doc|
			doc.add_sheet("Results") do |sheet|
				sheet.add_row(%w{Store Vicinity})

				result_uniq = {}

				results_group.each do |store|
					store.each do |r|
						if r["types"].include? "store"
							if !result_uniq[r["vicinity"]]
								result_uniq[r["vicinity"]] = 1
								sheet.add_row([r["name"], r["vicinity"]])
							end
						end
					end
				end
			end
		end
	end
end