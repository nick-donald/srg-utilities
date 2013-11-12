require 'spec_helper'

class DummyClass
end

describe ApiKeys do
    before(:each) do
        @dummy_class = Class.new { extend ApiKeys }
    end
end

describe AddresserHelper do
    before(:each) do
        @dummy_class = Class.new { extend AddresserHelper }
    end

    describe "#addresser" do
        it "should return array" do
            @dummy_class.addresser("target", "chicago", 10).class.should == Array
        end
    end
end