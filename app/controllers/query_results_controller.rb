class QueryResultsController < ApplicationController

    def destroy
        QueryResult.delete(params[:id])
        render nothing: true
    end
end
