require 'spec_helper'

class DummyClass
end

describe AddresserHelper do
    before(:each) do 
        @dummy_class = Class.new { extend AddresserHelper }
    end

    describe "#hi" do
        it "says hi" do
            @dummy_class.hi("bob").should == "hi bob"
        end
    end

    describe "#test" do
        it "returns array" do
            @dummy_class.test.class.should == Array
        end
    end
end