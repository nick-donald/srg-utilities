class QueryResultsController < ApplicationController
    include Addresser

    def destroy
        QueryResult.delete(params[:id])
        render nothing: true
    end

    def get_excel
        results = QueryResult.where("query_id = ?", params[:query_id])
        query_id = params[:query_id]
        assemble_excel results
        respond_to do |format|
            format.json { render json: { query_id: query_id }}
        end
    end

    def download_excel
        query = Query.find_by_id(params[:query_id])
        send_file query.filepath
    end
end
